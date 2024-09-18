/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiAudioResponseFormat } from './audio-response-format.js';
/**
 * Transcription request.
 */
export type AzureOpenAiCreateTranscriptionRequest = {
  /**
   * The audio file object to transcribe.
   * Format: "binary".
   */
  file: string;
  /**
   * An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language.
   */
  prompt?: string;
  response_format?: AzureOpenAiAudioResponseFormat;
  /**
   * The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use log probability to automatically increase the temperature until certain thresholds are hit.
   */
  temperature?: number;
  /**
   * The language of the input audio. Supplying the input language in ISO-639-1 format will improve accuracy and latency.
   */
  language?: string;
} & Record<string, any>;
