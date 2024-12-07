/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiAudioResponse } from './audio-response.js';
import type { AzureOpenAiAudioSegment } from './audio-segment.js';
/**
 * Translation or transcription response when response_format was verbose_json
 */
export type AzureOpenAiAudioVerboseResponse = AzureOpenAiAudioResponse & {
  /**
   * Type of audio task.
   */
  task?: 'transcribe' | 'translate';
  /**
   * Language.
   */
  language?: string;
  /**
   * Duration.
   */
  duration?: number;
  segments?: AzureOpenAiAudioSegment[];
} & Record<string, any>;
