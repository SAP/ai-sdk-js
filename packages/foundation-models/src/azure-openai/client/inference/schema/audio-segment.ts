/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Transcription or translation segment.
 */
export type AzureOpenAiAudioSegment = {
  /**
   * Segment identifier.
   */
  id?: number;
  /**
   * Offset of the segment.
   */
  seek?: number;
  /**
   * Segment start offset.
   */
  start?: number;
  /**
   * Segment end offset.
   */
  end?: number;
  /**
   * Segment text.
   */
  text?: string;
  /**
   * Tokens of the text.
   */
  tokens?: number[];
  /**
   * Temperature.
   */
  temperature?: number;
  /**
   * Average log probability.
   */
  avg_logprob?: number;
  /**
   * Compression ratio.
   */
  compression_ratio?: number;
  /**
   * Probability of 'no speech'.
   */
  no_speech_prob?: number;
} & Record<string, any>;
