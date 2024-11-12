/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Options for streaming. Will be ignored if stream is false.
 */
export type GlobalStreamOptions = {
  /**
   * Number of characters per chunk that post-LLM modules operate on.
   * Default: 100.
   * Maximum: 10000.
   * Minimum: 1.
   */
  chunk_size?: number;
};
