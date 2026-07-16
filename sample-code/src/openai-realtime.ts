/* eslint-disable no-console, import-x/no-internal-modules */
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
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
          audio: { output: { voice: { id: voice } } },
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
 * Plays raw PCM audio through the `play` command (from SoX). Requires SoX to be installed.
 */
class AudioPlayer {
  private stdin: NodeJS.WritableStream;

  constructor() {
    this.stdin = this.spawnPlay();
  }

  enqueue(data: Buffer): void {
    (this.stdin as Writable).write(data);
  }

  interrupt(): void {
    this.stdin.end();
    this.stdin = this.spawnPlay();
  }

  close(): void {
    this.stdin.end();
  }

  private spawnPlay(): NodeJS.WritableStream {
    // prettier-ignore
    const proc = spawn('play', ['-t', 'raw', '-r', `${realtimeSampleRate}`, '-c', '1', '-e', 'signed-integer', '-b', '16', '-'],
      { stdio: ['pipe', 'ignore', 'ignore'] }
    );
    proc.on('error', err => console.error('[play error]', err.message));
    return proc.stdin!;
  }
}

/**
 * Interactive speech-to-speech demo: records microphone input via SoX, streams it to the
 * Realtime API, and plays back the spoken response. Requires SoX (`sox`/`play`) to be installed.
 *
 * This function runs until the process is interrupted (Ctrl+C). It is intended for local,
 * hands-on exploration and is not used by the automated tests.
 * @returns A promise that never resolves under normal operation.
 */
export async function realtimeSpeechToSpeech(): Promise<void> {
  const client = await SapOpenAiRealtime.createClient('gpt-realtime');
  const player = new AudioPlayer();

  // prettier-ignore
  const soxArgs = ['-d', '-t', 'raw', '-r', `${realtimeSampleRate}`,
    '-c', '1', '-e', 'signed-integer', '-b', '16', '-'];

  // Resume stdin so keypress listeners actually fire.
  process.stdin.resume();

  function recordAndSend(): Promise<void> {
    return new Promise(resolve => {
      console.log('[mic] Recording... press Enter to stop.');
      const sox = spawn('sox', soxArgs, {
        stdio: ['ignore', 'pipe', 'ignore']
      });

      sox.stdout.on('data', (chunk: Buffer) => {
        client.send({
          type: 'input_audio_buffer.append',
          audio: chunk.toString('base64')
        });
      });

      const stopRecording = (): void => {
        sox.kill('SIGINT');
      };
      process.stdin.once('data', stopRecording);

      sox.on('close', () => {
        process.stdin.removeListener('data', stopRecording);
        client.send({ type: 'input_audio_buffer.commit' });
        client.send({ type: 'response.create' });
        resolve();
      });
    });
  }

  function promptUser(): void {
    process.stdout.write('\nPress Enter to start recording (Ctrl+C to quit): ');
    process.stdin.once('data', () => {
      process.stdout.write('Assistant: ');
      void recordAndSend();
    });
  }

  client.on('session.created', () => {
    client.send({
      type: 'session.update',
      session: {
        type: 'realtime',
        output_modalities: ['audio'],
        audio: {
          input: { format: { type: 'audio/pcm', rate: realtimeSampleRate } },
          output: { voice: { id: 'alloy' } }
        },
        instructions: 'You are a helpful assistant. Respond only in English.'
      }
    });
  });

  let greeted = false;
  client.on('session.updated', () => {
    if (!greeted) {
      greeted = true;
      promptUser();
    }
  });

  client.on('response.output_audio_transcript.delta', e =>
    process.stdout.write(e.delta ?? '')
  );
  client.on('response.output_audio_transcript.done', () => console.log());
  client.on('response.output_audio.delta', e => {
    if (e.delta) {
      player.enqueue(Buffer.from(e.delta, 'base64'));
    }
  });
  client.on('input_audio_buffer.speech_started', () => player.interrupt());
  client.on('response.done', () => promptUser());
  client.on('error', e => console.error('[ERROR]', e.message));

  await new Promise<void>(resolve => {
    process.once('SIGINT', () => {
      console.log('\n[bye]');
      player.close();
      client.close();
      process.stdin.pause();
      resolve();
    });
  });
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
