import {
  realtimeTextToAudio,
  pcm16ToWav,
  realtimeSampleRate,
  type RealtimeAudioResult
} from '@sap-ai-sdk/sample-code';
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';
import { expect, describe, it, beforeAll } from '@jest/globals';
import { loadEnv } from './utils/load-env.js';

loadEnv();

const keyword = 'banana';

/**
 * Audio quality metrics for signed 16-bit little-endian PCM, computed on the mean-subtracted
 * (DC-offset-removed) signal so they reflect only the varying, audible part of the audio.
 * @param pcm - The raw PCM audio buffer.
 * @returns The RMS amplitude and Shannon entropy (bits) of the zero-mean samples.
 */
function pcm16AudioMetrics(pcm: Buffer): { rms: number; entropy: number } {
  const sampleCount = Math.floor(pcm.length / 2);
  if (sampleCount === 0) {
    return { rms: 0, entropy: 0 };
  }
  let sum = 0;
  for (let i = 0; i < sampleCount; i++) {
    sum += pcm.readInt16LE(i * 2);
  }
  const mean = sum / sampleCount;

  let sumOfSquares = 0;
  const counts = new Map<number, number>();
  for (let i = 0; i < sampleCount; i++) {
    const residual = pcm.readInt16LE(i * 2) - mean;
    sumOfSquares += residual * residual;
    const key = Math.round(residual);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const rms = Math.sqrt(sumOfSquares / sampleCount);
  let entropy = 0;
  for (const count of counts.values()) {
    const p = count / sampleCount;
    entropy -= p * Math.log2(p);
  }
  return { rms, entropy };
}

/**
 * Independently verifies the spoken audio by forwarding it to an audio-capable model (Gemini).
 * @param wav - The WAV-encoded audio to transcribe.
 * @returns The transcript returned by the model.
 */
async function transcribeWithGemini(wav: Buffer): Promise<string | undefined> {
  const client = new OrchestrationClient({
    promptTemplating: { model: { name: 'gemini-2.5-flash' } }
  });
  const response = await client.chatCompletion({
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Transcribe the spoken words in the audio file.'
          },
          {
            type: 'file',
            file: {
              file_data: `data:audio/wav;base64,${wav.toString('base64')}`,
              filename: 'realtime.wav'
            }
          }
        ]
      }
    ]
  });
  return response.getContent();
}

describe('OpenAI Realtime API', () => {
  let result: RealtimeAudioResult;
  let elapsed: number;

  beforeAll(async () => {
    const realtimeStart = Date.now();
    result = await realtimeTextToAudio(keyword, 'verse');
    elapsed = Date.now() - realtimeStart;
  }, 60000);

  it('produces audio and transcript', async () => {
    // eslint-disable-next-line no-console
    console.log(
      `[realtime e2e] realtimeTextToAudio took ${elapsed}ms; ` +
        `audio=${result.audio.length} bytes, transcript=${JSON.stringify(
          result.transcript
        )}`
    );

    expect(result.transcript.toLowerCase()).toContain(keyword);
  }, 60000);

  // The audio quality metrics are computed on the mean-subtracted signal so they reflect only the varying, audible part of the audio.
  it('produces non-silent PCM audio', () => {
    const { rms, entropy } = pcm16AudioMetrics(result.audio);

    // eslint-disable-next-line no-console
    console.log(
      `[realtime e2e] audio quality: rms=${rms.toFixed(1)}, entropy=${entropy.toFixed(2)} bits`
    );

    // At least ~0.5s of 16-bit mono audio.
    expect(result.audio.length).toBeGreaterThan(realtimeSampleRate);
    // RMS (mean-subtracted): clearly above digital silence — confirms the server sent audible
    // signals
    expect(rms).toBeGreaterThan(500);
    // Entropy: rejects loud-transient false positives that RMS alone misses.
    expect(entropy).toBeGreaterThan(4);
  });

  // Audio-capable models (Gemini) can be used to independently verify the spoken audio.
  it('produces audio verifiable by an audio-capable model (Gemini)', async () => {
    const wav = pcm16ToWav(result.audio);
    const transcript = await transcribeWithGemini(wav);
    expect(transcript?.toLowerCase()).toContain(keyword);
  }, 60000);
});
