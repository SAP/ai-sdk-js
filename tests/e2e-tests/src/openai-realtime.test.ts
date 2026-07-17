import {
  realtimeTextToAudio,
  realtimeAudioToAudio,
  realtimeWithToolCalling,
  loadRealtimeInputPcm,
  pcm16ToWav,
  realtimeSampleRate,
  type RealtimeAudioResult,
  type RealtimeToolCallResult
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

// Voice-in → voice-out round trip: a bundled PCM sample ("What is the capital of France?") is
// streamed to the Realtime API as input, and the spoken response is transcribed.
//
// The prompt is a factual question (rather than "repeat the word X") so the expected response is
// determined by semantics — robust to the minor misrecognitions that synthesized input can suffer
// (e.g. "banana" being heard as "banal").
describe('OpenAI Realtime API with voice input', () => {
  const expectedWord = 'paris';
  let inputPcm: Buffer;
  let result: RealtimeAudioResult;
  let elapsed: number;

  beforeAll(async () => {
    inputPcm = await loadRealtimeInputPcm();
    const realtimeStart = Date.now();
    result = await realtimeAudioToAudio(inputPcm, 'verse');
    elapsed = Date.now() - realtimeStart;
  }, 60000);

  it('responds to spoken input with the expected answer', async () => {
    // eslint-disable-next-line no-console
    console.log(
      `[realtime e2e] realtimeAudioToAudio took ${elapsed}ms; ` +
        `input=${inputPcm.length} bytes, output audio=${result.audio.length} bytes, ` +
        `transcript=${JSON.stringify(result.transcript)}`
    );

    expect(result.transcript.toLowerCase()).toContain(expectedWord);
  }, 60000);

  it('produces non-silent PCM audio in response', () => {
    const { rms, entropy } = pcm16AudioMetrics(result.audio);

    // eslint-disable-next-line no-console
    console.log(
      '[realtime e2e] voice-input response audio quality: ' +
        `rms=${rms.toFixed(1)}, entropy=${entropy.toFixed(2)} bits`
    );

    expect(result.audio.length).toBeGreaterThan(realtimeSampleRate);
    expect(rms).toBeGreaterThan(500);
    expect(entropy).toBeGreaterThan(4);
  });

  it('produces audio verifiable by an audio-capable model (Gemini)', async () => {
    const wav = pcm16ToWav(result.audio);
    const transcript = await transcribeWithGemini(wav);
    expect(transcript?.toLowerCase()).toContain(expectedWord);
  }, 60000);
});

// Tool calling: a text prompt is sent with a `get_weather` function tool registered. The model is
// expected to emit a `function_call` item, after which the client returns a mocked weather output
// and requests a second response. The final text answer should reference both the requested
// location and the mocked weather conditions.
describe('OpenAI Realtime API with tool calling', () => {
  const location = 'Paris';
  const mockedWeather = 'Sunny, 21°C';
  let result: RealtimeToolCallResult;
  let elapsed: number;

  beforeAll(async () => {
    const realtimeStart = Date.now();
    result = await realtimeWithToolCalling(
      `What's the weather in ${location} right now?`,
      mockedWeather
    );
    elapsed = Date.now() - realtimeStart;
  }, 60000);

  it('invokes the get_weather tool with a location argument', () => {
    // eslint-disable-next-line no-console
    console.log(
      `[realtime e2e] realtimeWithToolCalling took ${elapsed}ms; ` +
        `tool=${result.toolName}, args=${result.toolArguments}, ` +
        `output=${result.toolOutput}, text=${JSON.stringify(result.text)}`
    );

    expect(result.toolName).toBe('get_weather');
    const args = JSON.parse(result.toolArguments);
    expect(args.location).toMatch(new RegExp(location, 'i'));
  }, 60000);

  it('produces a final answer referencing the location and the tool output', () => {
    const text = result.text.toLowerCase();
    expect(text).toContain(location.toLowerCase());
    // The model should reflect the mocked conditions, e.g. "sunny" or "21°c".
    expect(text).toMatch(/sunny|21|°c|celsius/);
  }, 60000);
});
