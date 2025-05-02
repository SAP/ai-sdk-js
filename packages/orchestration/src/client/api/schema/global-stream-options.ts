/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Options for streaming. Will be ignored if stream is false.
 */
export type GlobalStreamOptions = {
  /**
   * Minimum number of characters per chunk that post-LLM modules operate on.
   * Default: 100.
   * Maximum: 10000.
   * Minimum: 1.
   */
  chunk_size?: number;
  /**
   * List of delimiters to split the input text into chunks.Please note, this is a required parameter when `input_translation_module_config` or `output_translation_module_config` are configured.
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
