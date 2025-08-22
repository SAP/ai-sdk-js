/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Options for streaming. Will be ignored if enabled is false.
 *
 * **Note**: The `delimiters` field is required when either `config.modules.translation.input` or `config.modules.translation.output` are configured.
 *
 */
export type GlobalStreamOptions = {
  /**
   * If true, the response will be streamed back to the client
   */
  enabled?: boolean;
  /**
   * Minimum number of characters per chunk that post-LLM modules operate on.
   * Default: 100.
   * Maximum: 10000.
   * Minimum: 1.
   */
  chunk_size?: number;
  /**
   * List of delimiters to split the input text into chunks.
   *
   * **Required** if `config.modules.translation.input` or `config.modules.translation.output` are configured.
   *
   * @example [
   *   "\n",
   *   ".",
   *   "?",
   *   "!"
   * ]
   * Min Items: 1.
   */
  delimiters?: string[];
};
