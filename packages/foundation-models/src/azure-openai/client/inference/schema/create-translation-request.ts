/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiAudioResponseFormat } from './audio-response-format.js';
/**
 * Translation request.
 */
export type AzureOpenAiCreateTranslationRequest = {
  /**
   * The audio file to translate.
   * Format: "binary".
   */
  file: string;
  /**
   * An optional text to guide the model's style or continue a previous audio segment. The prompt should be in English.
   */
  prompt?: string;
  response_format?: AzureOpenAiAudioResponseFormat;
  /**
   * The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use log probability to automatically increase the temperature until certain thresholds are hit.
   */
  temperature?: number;
} & Record<string, any>;
