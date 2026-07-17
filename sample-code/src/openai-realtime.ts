/* eslint-disable no-console, import-x/no-internal-modules */
import { spawn, spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import readline from 'node:readline';
import { styleText } from 'node:util';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { zstdDecompressSync } from 'node:zlib';
import { SapOpenAiRealtime } from '@sap-ai-sdk/openai/realtime';
import type { Writable } from 'node:stream';

/**
 * Sample rate (Hz) of the PCM audio produced by the Realtime API.
 */
export const realtimeSampleRate = 24000;

/**
 * Result of a Realtime API turn that produced audio output.
 */
export interface RealtimeAudioResult {
  /** The transcript of the spoken audio response. */
  transcript: string;
  /** The raw signed 16-bit little-endian mono PCM audio at {@link realtimeSampleRate}. */
  audio: Buffer;
}

/**
 * Result of a Realtime API turn that exercised a function tool.
 *
 * The model emits a `function_call` item, the client returns a mocked tool output, and the model
 * then produces a final text answer that incorporates that output.
 */
export interface RealtimeToolCallResult {
  /** The name of the function the model called, or an empty string if it answered directly. */
  toolName: string;
  /** The raw JSON-encoded arguments string the model produced for the call. */
  toolArguments: string;
  /** The mocked tool output that was sent back to the model. */
  toolOutput: string;
  /** The final text response produced after the tool output was provided. */
  text: string;
}

/**
 * Send a text prompt to the OpenAI Realtime API and collect the spoken audio response.
 *
 * Uses the GA `session.update` schema (`output_modalities`, nested `audio`), which is what SAP AI Core expects.
 * @param text - The text prompt to send to the model.
 * @param voice - The voice to use for the audio response. Defaults to `alloy`.
 * @returns A promise that resolves to the transcript and raw PCM audio of the response.
 */
export async function realtimeTextToAudio(
  text = 'Please say the exact word: banana.',
  voice = 'alloy'
): Promise<RealtimeAudioResult> {
  const client = await SapOpenAiRealtime.createClient('gpt-realtime');

  return new Promise<RealtimeAudioResult>((resolve, reject) => {
    const audioChunks: Buffer[] = [];
    let transcript = '';

    client.on('error', err => {
      client.close();
      reject(err);
    });

    client.on('session.created', () => {
      client.send({
        type: 'session.update',
        session: {
          type: 'realtime',
          output_modalities: ['audio'],
          audio: { output: { voice } },
          instructions: 'You are a helpful assistant. Respond only in English.'
        }
      });
    });

    client.on('session.updated', () => {
      client.send({
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [{ type: 'input_text', text }]
        }
      });
      client.send({ type: 'response.create' });
    });

    client.on('response.output_audio_transcript.delta', e => {
      transcript += e.delta ?? '';
    });

    client.on('response.output_audio.delta', e => {
      if (e.delta) {
        audioChunks.push(Buffer.from(e.delta, 'base64'));
      }
    });

    client.on('response.done', () => {
      client.close();
      resolve({
        transcript: transcript.trim(),
        audio: Buffer.concat(audioChunks)
      });
    });
  });
}

/**
 * Wrap raw signed 16-bit little-endian mono PCM audio in a WAV container.
 * Useful for saving Realtime API audio to disk or forwarding it to an audio-capable model.
 * @param pcm - The raw PCM audio buffer.
 * @param sampleRate - The sample rate of the PCM audio in Hz. Defaults to {@link realtimeSampleRate}.
 * @returns A WAV-encoded audio buffer.
 */
export function pcm16ToWav(
  pcm: Buffer,
  sampleRate: number = realtimeSampleRate
): Buffer {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
}

/**
 * Load the bundled Realtime voice-input sample as raw PCM.
 *
 * Reads and decompresses `resources/realtime-input.pcm.zst` (zstd-compressed to keep the fixture
 * small) into signed 16-bit little-endian mono PCM at {@link realtimeSampleRate}, ready to stream to
 * the Realtime API via `input_audio_buffer.append`.
 * @returns The raw PCM audio buffer.
 */
export async function loadRealtimeInputPcm(): Promise<Buffer> {
  const compressed = await readFile(
    join(import.meta.dirname, '..', 'resources', 'realtime-input.pcm.zst')
  );
  return zstdDecompressSync(compressed);
}

/**
 * Send spoken audio to the OpenAI Realtime API and collect the spoken audio response.
 *
 * Configures the session for PCM input (server-side VAD disabled so the buffer is committed
 * manually), streams the input in ~100ms chunks, then commits and requests a response. Uses the
 * GA `session.update` schema, which is what SAP AI Core expects.
 * @param inputPcm - Raw signed 16-bit little-endian mono PCM at {@link realtimeSampleRate}.
 * @param voice - The voice to use for the audio response. Defaults to `alloy`.
 * @returns A promise that resolves to the transcript and raw PCM audio of the response.
 */
export async function realtimeAudioToAudio(
  inputPcm: Buffer,
  voice = 'alloy'
): Promise<RealtimeAudioResult> {
  const client = await SapOpenAiRealtime.createClient('gpt-realtime');

  return new Promise<RealtimeAudioResult>((resolve, reject) => {
    const audioChunks: Buffer[] = [];
    let transcript = '';

    client.on('error', err => {
      client.close();
      reject(err);
    });

    client.on('session.created', () => {
      client.send({
        type: 'session.update',
        session: {
          type: 'realtime',
          output_modalities: ['audio'],
          audio: {
            input: {
              format: { type: 'audio/pcm', rate: realtimeSampleRate },
              turn_detection: null
            },
            output: { voice }
          },
          instructions: 'You are a helpful assistant. Respond only in English.'
        }
      });
    });

    client.on('session.updated', () => {
      // 4800 bytes = 100ms of 16-bit mono audio at 24kHz; the backend rejects commits under 100ms.
      const chunkSize = 4800;
      for (let i = 0; i < inputPcm.length; i += chunkSize) {
        const chunk = inputPcm.subarray(i, i + chunkSize);
        client.send({
          type: 'input_audio_buffer.append',
          audio: chunk.toString('base64')
        });
      }
      client.send({ type: 'input_audio_buffer.commit' });
      client.send({ type: 'response.create' });
    });

    client.on('response.output_audio_transcript.delta', e => {
      transcript += e.delta ?? '';
    });

    client.on('response.output_audio.delta', e => {
      if (e.delta) {
        audioChunks.push(Buffer.from(e.delta, 'base64'));
      }
    });

    client.on('response.done', () => {
      client.close();
      resolve({
        transcript: transcript.trim(),
        audio: Buffer.concat(audioChunks)
      });
    });
  });
}

/**
 * Send a text prompt to the OpenAI Realtime API with a `get_weather` function tool registered, then
 * satisfy the resulting tool call with a mocked weather output and collect the model's final text
 * answer.
 *
 * Configures the session for text-only output (`output_modalities: ['text']`) so the response is
 * deterministic and easy to assert on. Uses the GA `session.update` schema, which is what SAP AI
 * Core expects.
 * @param prompt - The text prompt to send to the model. Defaults to a weather question about Paris.
 * @param toolOutput - The mocked weather string to return to the model when it calls `get_weather`.
 * Defaults to `'Sunny, 21°C'`.
 * @returns A promise that resolves to the captured tool call and the final text response.
 */
export async function realtimeWithToolCalling(
  prompt = "What's the weather in Paris right now?",
  toolOutput = 'Sunny, 21°C'
): Promise<RealtimeToolCallResult> {
  const client = await SapOpenAiRealtime.createClient('gpt-realtime');

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

  return new Promise<RealtimeToolCallResult>((resolve, reject) => {
    let text = '';
    let toolCall:
      { callId: string; name: string; arguments: string } | undefined;
    let responseDoneCount = 0;

    client.on('error', err => {
      client.close();
      reject(err);
    });

    client.on('session.created', () => {
      client.send({
        type: 'session.update',
        session: {
          type: 'realtime',
          output_modalities: ['text'],
          tools: [getWeatherTool],
          instructions:
            'You are a helpful assistant. Use the get_weather tool to answer questions about the weather, then summarize the result for the user in one short sentence.'
        }
      });
    });

    client.on('session.updated', () => {
      client.send({
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [{ type: 'input_text', text: prompt }]
        }
      });
      client.send({ type: 'response.create' });
    });

    // The model streams the function-call arguments; once complete, return the mocked output and
    // request a second response so the model can phrase the answer for the user.
    client.on('response.function_call_arguments.done', e => {
      toolCall = {
        callId: e.call_id,
        name: e.name,
        arguments: e.arguments
      };
      client.send({
        type: 'conversation.item.create',
        item: {
          type: 'function_call_output',
          call_id: e.call_id,
          output: JSON.stringify({ weather: toolOutput })
        }
      });
      client.send({ type: 'response.create' });
    });

    client.on('response.output_text.delta', e => {
      text += e.delta ?? '';
    });

    client.on('response.done', () => {
      responseDoneCount++;
      // First response: a function call is in flight — wait for the second response.
      if (responseDoneCount === 1 && toolCall) {
        return;
      }
      client.close();
      resolve({
        toolName: toolCall?.name ?? '',
        toolArguments: toolCall?.arguments ?? '',
        toolOutput,
        text: text.trim()
      });
    });
  });
}

/**
 * Plays raw PCM audio through SoX, piping raw audio to its stdin and writing to the default
 * audio device (`-d`). Using `sox ... -d` instead of the `play` wrapper avoids depending on a
 * `play` executable, which the Windows `sox_ng` package does not ship. Requires SoX to be installed.
 */
class AudioPlayer {
  private stdin: NodeJS.WritableStream;
  private proc: ReturnType<typeof spawn> | undefined;
  private readonly soxBin: string;
  private disposed = false;

  constructor(soxBin: string) {
    this.soxBin = soxBin;
    this.proc = this.spawnPlay();
    this.stdin = this.proc.stdin!;
  }

  enqueue(data: Buffer): void {
    if (this.disposed || this.proc?.exitCode !== null || this.proc?.killed) {
      return; // play process has exited; drop audio instead of throwing EPIPE
    }
    try {
      (this.stdin as Writable).write(data);
    } catch {
      // play process died mid-write; respawn-on-exit will spin up a fresh proc
    }
  }

  interrupt(): void {
    this.kill();
    this.proc = this.spawnPlay();
    this.stdin = this.proc.stdin!;
  }

  close(): void {
    this.disposed = true;
    this.kill();
  }

  private kill(): void {
    const proc = this.proc;
    if (proc && proc.exitCode === null && !proc.killed) {
      proc.kill('SIGTERM');
    }
  }

  private spawnPlay(): ReturnType<typeof spawn> {
    // prettier-ignore
    const proc = spawn(this.soxBin, ['-t', 'raw', '-r', `${realtimeSampleRate}`, '-c', '1', '-e', 'signed-integer', '-b', '16', '-', '-d'],
      { stdio: ['pipe', 'ignore', 'ignore'] }
    );
    const startedAt = Date.now();
    proc.on('error', err =>
      console.error(`${styleText(['red'], '[play error]')} ${err.message}`)
    );
    // Swallow async write errors (EPIPE) on the stdin: when interrupt() kills this proc,
    // the OS may still be flushing buffered audio and emit EPIPE on the dead pipe. Without a
    // listener Node logs it as an unhandled 'error' event.
    proc.stdin?.on('error', () => {});
    // Auto-respawn if sox exits on its own (audio-device error, crash, etc.) so playback
    // resumes on the next chunk instead of silently dropping the rest of the response.
    // Skipped when we intentionally killed it: interrupt() has already replaced this.proc
    // (so this proc is no longer current), and close() sets `disposed`. An exit within 250ms
    // of spawn means sox couldn't start at all — don't retry, or we'd tight-loop.
    proc.on('exit', () => {
      if (this.disposed || this.proc !== proc) {
        return;
      }
      if (Date.now() - startedAt < 250) {
        this.proc = undefined;
        return;
      }
      this.proc = this.spawnPlay();
      this.stdin = this.proc.stdin!;
    });
    return proc;
  }
}

/**
 * Resolve the SoX binary to invoke, preferring `sox` and falling back to `sox_ng` (the maintained
 * fork, which is what the Windows winget package and some distros ship). Returns the binary name
 * or `undefined` if neither is on PATH.
 * @returns `sox` or `sox_ng` if found on PATH, otherwise `undefined`.
 */
function resolveSoxBin(): string | undefined {
  return ['sox', 'sox_ng'].find(
    bin => spawnSync(bin, ['--version'], { stdio: 'ignore' }).status === 0
  );
}

/**
 * Verify that SoX is installed and return the binary name (`sox` or `sox_ng`).
 * Exits the process with install instructions if it is missing.
 * @returns The SoX binary name to invoke.
 */
function checkPrerequisites(): string {
  const soxBin = resolveSoxBin();
  if (soxBin) {
    return soxBin;
  }
  console.error(
    `\n${styleText(['red', 'bold'], '[prerequisites]')} Missing required command: ${styleText(['red'], 'sox')}`
  );
  console.error(
    'This demo needs SoX for mic capture and audio playback (it uses `sox ... -d`, so no separate `play` binary is required).'
  );
  console.error('Install it with one of:');
  console.error(`  ${styleText(['dim'], 'macOS:   brew install sox')}`);
  console.error(
    `  ${styleText(['dim'], 'Windows: winget install --id sox_ng.sox_ng -e')}`
  );
  console.error('');
  process.exit(1);
}

/**
 * Interactive speech-to-speech demo: streams the microphone to the Realtime API continuously
 * (server-side VAD detects speech turns for you) and plays back the spoken response. Typed lines
 * on stdin are injected as user messages at the same time. Requires SoX (`sox`/`play`) to be installed.
 *
 * This function runs until the process is interrupted (Ctrl+C). It is intended for local,
 * hands-on exploration and is not used by the automated tests.
 * @returns A promise that never resolves under normal operation.
 */
export async function realtimeSpeechToSpeech(): Promise<void> {
  const soxBin = checkPrerequisites();
  const client = await SapOpenAiRealtime.createClient('gpt-realtime');
  const player = new AudioPlayer(soxBin);

  // prettier-ignore
  const soxArgs = ['-d', '-t', 'raw', '-r', `${realtimeSampleRate}`,
    '-c', '1', '-e', 'signed-integer', '-b', '16', '-'];

  let sox: ReturnType<typeof spawn> | undefined;
  let responseInProgress = false;
  let pendingTextResponse = false;

  // Text input: typed lines are injected as user messages alongside the live mic stream.
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: process.stdin.isTTY ?? false
  });

  function submitText(text: string): void {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    client.send({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text: trimmed }]
      }
    });
    if (responseInProgress) {
      // A voice response is in flight; trigger a response once it finishes.
      pendingTextResponse = true;
      console.log(`${styleText(['yellow'], '[queued]')} "${trimmed}"`);
    } else {
      responseInProgress = true;
      client.send({ type: 'response.create' });
    }
  }

  rl.on('line', submitText);

  client.on('session.created', () => {
    client.send({
      type: 'session.update',
      session: {
        type: 'realtime',
        output_modalities: ['audio'],
        audio: {
          input: { format: { type: 'audio/pcm', rate: realtimeSampleRate } },
          output: { voice: 'alloy' }
        },
        instructions: 'You are a helpful assistant. Respond only in English.'
      }
    });
  });

  client.on('session.updated', () => {
    if (sox) {
      return; // mic already started
    }
    console.log(
      `${styleText(['green', 'bold'], '[ready]')} Speak into the mic, or type a message and press Enter. Ctrl+C to quit.`
    );
    sox = spawn(soxBin, soxArgs, { stdio: ['ignore', 'pipe', 'ignore'] });
    sox.stdout!.on('data', (chunk: Buffer) => {
      client.send({
        type: 'input_audio_buffer.append',
        audio: chunk.toString('base64')
      });
    });
    sox.on('error', err =>
      console.error(`${styleText(['red'], '[sox error]')} ${err.message}`)
    );
  });

  client.on('response.created', () => {
    responseInProgress = true;
  });
  client.on('response.output_audio_transcript.delta', e =>
    process.stdout.write(styleText(['cyan'], e.delta ?? ''))
  );
  client.on('response.output_audio_transcript.done', () => console.log());
  client.on('response.output_audio.delta', e => {
    if (e.delta) {
      player.enqueue(Buffer.from(e.delta, 'base64'));
    }
  });
  client.on('input_audio_buffer.speech_started', () => {
    player.interrupt();
    process.stdout.write(`\n${styleText(['green'], '[you] ')}`);
  });
  client.on('response.done', () => {
    responseInProgress = false;
    if (pendingTextResponse) {
      pendingTextResponse = false;
      responseInProgress = true;
      client.send({ type: 'response.create' });
    }
  });
  client.on('error', e =>
    console.error(`${styleText(['red', 'bold'], '[ERROR]')} ${e.message}`)
  );

  function cleanup(): void {
    console.log(`\n${styleText(['dim'], '[bye]')}`);
    if (sox && !sox.killed) {
      sox.kill('SIGINT');
    }
    player.close();
    client.close();
    rl.close();
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    process.exit(0);
  }

  rl.on('SIGINT', cleanup);
  // Fallback in case stdin is not a TTY (readline won't emit SIGINT then).
  process.once('SIGINT', cleanup);

  // Runs until interrupted; never resolves under normal operation.
  await new Promise<void>(() => {});
}

// Run the interactive demo when this file is executed directly (e.g. `tsx src/openai-realtime.ts`).
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  realtimeSpeechToSpeech().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
