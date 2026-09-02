import { SapOpenAiRealtimeWs } from '@sap-ai-sdk/openai/realtime';

import { WebSocketServer } from 'ws';

import type { Server } from 'node:http';
import type WebSocket from 'ws';
import type { RawData } from 'ws';

type Mode = 'text-to-audio' | 'speech' | 'speech-ptt';

interface ConfigureMessage {
  type: 'configure';
  mode: Mode;
  voice?: string;
}

interface TextInputMessage {
  type: 'text_input';
  text: string;
}

interface InterruptMessage {
  type: 'interrupt';
}

interface CommitAudioMessage {
  type: 'commit_audio';
}

interface SetPttMessage {
  type: 'set_ptt';
  enabled: boolean;
}

type BrowserMessage =
  | ConfigureMessage
  | TextInputMessage
  | InterruptMessage
  | CommitAudioMessage
  | SetPttMessage;

const getWeatherTool = {
  type: 'function' as const,
  name: 'get_weather',
  description: 'Get the current weather for a given location.',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'The city and country, e.g. "Paris, France".'
      }
    },
    required: ['location']
  }
};

const instructions =
  'You are a helpful assistant. Respond only in English. ' +
  'When asked about weather, use the get_weather tool and summarize the result in one short sentence.';

function buildSessionUpdate(mode: Mode, voice = 'marin') {
  return {
    type: 'session.update' as const,
    session: {
      type: 'realtime' as const,
      output_modalities: ['audio'] as ['audio'],
      tools: [getWeatherTool],
      audio: {
        ...(mode === 'text-to-audio'
          ? {}
          : {
              input: {
                format: { type: 'audio/pcm' as const, rate: 24000 as const },
                turn_detection:
                  mode === 'speech' ? { type: 'server_vad' as const } : null
              }
            }),
        output: { voice }
      },
      instructions
    }
  };
}

interface GeocodingResponse {
  results?: { latitude: number; longitude: number; name: string }[];
}

// Same Open-Meteo lookup as the weather MCP tutorial, kept local so the demo is self-contained.
async function fetchWeather(location: string): Promise<string> {
  const city = location.split(',')[0].trim();
  const geoUrl = new URL('https://geocoding-api.open-meteo.com/v1/search');
  geoUrl.search = new URLSearchParams({
    name: city,
    count: '10',
    language: 'en',
    format: 'json'
  }).toString();
  const geoRes = await fetch(geoUrl);
  const geoData = (await geoRes.json()) as GeocodingResponse;

  if (!geoData.results?.length) {
    return `No location found for: ${location}`;
  }

  const { latitude, longitude, name } = geoData.results[0];
  const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
  forecastUrl.search = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly:
      'temperature_2m,precipitation,apparent_temperature,relative_humidity_2m',
    forecast_days: '1'
  }).toString();
  const forecastRes = await fetch(forecastUrl);
  const forecastData = await forecastRes.json();

  return `${name}: ${JSON.stringify(forecastData, null, 2)}`;
}

function sendJson(ws: WebSocket, payload: object): void {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

function appendAudio(client: SapOpenAiRealtimeWs, chunk: Buffer): void {
  client.send({
    type: 'input_audio_buffer.append',
    audio: chunk.toString('base64')
  });
}

function forwardTranscriptDelta(browserWs: WebSocket, delta?: string): void {
  if (delta) {
    sendJson(browserWs, { type: 'transcript', role: 'ai', delta });
  }
}

export function attachRealtimeWs(server: Server): void {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    if (req.url !== '/openai-realtime/ws') {
      return;
    }
    wss.handleUpgrade(req, socket, head, ws => {
      wss.emit('connection', ws, req);
    });
  });

  wss.on('connection', (browserWs: WebSocket) => {
    let client: SapOpenAiRealtimeWs | undefined;
    let sessionReady = false;
    const audioQueue: Buffer[] = [];

    function flushAudioQueue(): void {
      if (!client) {
        return;
      }
      audioQueue.forEach(chunk => appendAudio(client!, chunk));
      audioQueue.length = 0;
    }

    function toBuffer(data: RawData): Buffer {
      if (Buffer.isBuffer(data)) {
        return data;
      }
      if (Array.isArray(data)) {
        return Buffer.concat(data);
      }
      return Buffer.from(data);
    }

    async function resolveToolCall(
      realtime: SapOpenAiRealtimeWs,
      event: { call_id: string; arguments: string }
    ): Promise<void> {
      let result: string;
      try {
        const args = JSON.parse(event.arguments) as { location?: string };
        result = await fetchWeather(args.location ?? '');
      } catch (err) {
        result = `Error: ${err instanceof Error ? err.message : String(err)}`;
      }
      sendJson(browserWs, { type: 'tool_result', result });
      realtime.send({
        type: 'conversation.item.create',
        item: {
          type: 'function_call_output',
          call_id: event.call_id,
          output: result
        }
      });
      realtime.send({ type: 'response.create' });
    }

    browserWs.on(
      'message',
      (data, isBinary) => void handleMessage(data, isBinary)
    );

    function handleAudio(data: RawData): void {
      if (!client) {
        return;
      }
      const chunk = toBuffer(data);
      if (sessionReady) {
        appendAudio(client, chunk);
      } else {
        audioQueue.push(chunk);
      }
    }

    async function configure(mode: Mode, voice?: string): Promise<void> {
      client?.close();
      sessionReady = false;
      audioQueue.length = 0;

      let realtime: SapOpenAiRealtimeWs;
      try {
        realtime = await SapOpenAiRealtimeWs.createClient('gpt-realtime');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        sendJson(browserWs, { type: 'error', message });
        browserWs.close();
        return;
      }
      client = realtime;

      realtime.on('error', err => {
        sendJson(browserWs, { type: 'error', message: err.message });
        browserWs.close();
      });
      realtime.on('session.created', () => {
        realtime.send(buildSessionUpdate(mode, voice));
      });
      realtime.on('session.updated', () => {
        if (sessionReady) {
          return;
        }
        sessionReady = true;
        flushAudioQueue();
        sendJson(browserWs, { type: 'ready' });
      });
      realtime.on('input_audio_buffer.speech_started', () => {
        sendJson(browserWs, { type: 'speech_started' });
      });
      realtime.on('input_audio_buffer.speech_stopped', () => {
        sendJson(browserWs, { type: 'speech_stopped' });
      });
      realtime.on('response.output_audio.delta', e => {
        if (e.delta) {
          browserWs.send(Buffer.from(e.delta, 'base64'));
        }
      });

      realtime.on('response.output_audio_transcript.delta', e =>
        forwardTranscriptDelta(browserWs, e.delta)
      );
      realtime.on('response.output_text.delta', e =>
        forwardTranscriptDelta(browserWs, e.delta)
      );
      realtime.on('response.function_call_arguments.done', e => {
        sendJson(browserWs, {
          type: 'tool_call',
          name: e.name,
          arguments: e.arguments
        });
        void resolveToolCall(realtime, e);
      });
      realtime.on('response.done', () => {
        sendJson(browserWs, { type: 'done' });
      });
    }

    async function handleMessage(
      data: RawData,
      isBinary: boolean
    ): Promise<void> {
      if (isBinary) {
        handleAudio(data);
        return;
      }

      let msg: BrowserMessage;
      try {
        msg = JSON.parse(toBuffer(data).toString()) as BrowserMessage;
      } catch {
        sendJson(browserWs, { type: 'error', message: 'invalid JSON' });
        return;
      }

      if (msg.type === 'configure') {
        await configure(msg.mode, msg.voice);
        return;
      }

      if (!client) {
        sendJson(browserWs, { type: 'error', message: 'send configure first' });
        return;
      }

      if (msg.type === 'text_input') {
        client.send({
          type: 'conversation.item.create',
          item: {
            type: 'message',
            role: 'user',
            content: [{ type: 'input_text', text: msg.text }]
          }
        });
        client.send({ type: 'response.create' });
      } else if (msg.type === 'commit_audio') {
        client.send({ type: 'input_audio_buffer.commit' });
        client.send({ type: 'response.create' });
      } else if (msg.type === 'set_ptt') {
        client.send({
          type: 'session.update',
          session: {
            type: 'realtime',
            audio: {
              input: {
                format: { type: 'audio/pcm' as const, rate: 24000 as const },
                turn_detection: msg.enabled
                  ? null
                  : { type: 'server_vad' as const }
              }
            }
          }
        });
      } else if (msg.type === 'interrupt') {
        client.send({ type: 'response.cancel' });
      }
    }

    browserWs.on('close', () => {
      client?.close();
    });
  });
}
