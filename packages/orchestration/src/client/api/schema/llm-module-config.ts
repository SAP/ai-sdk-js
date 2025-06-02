/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'LlmModuleConfig' schema.
 */
export type LlmModuleConfig = {
  /**
   * Model name as in LLM Access configuration
   * @example "gpt-4o-mini"
   */
  model_name: string;
  /**
   * Model parameters
   * @example {
   *   "max_tokens": 300,
   *   "temperature": 0.1,
   *   "frequency_penalty": 0,
   *   "presence_penalty": 0,
   *   "n": 2,
   *   "stream_options": {
   *     "include_usage": true
   *   }
   * }
   */
  model_params?: Record<string, any>;
  /**
   * Version of the model to use
   * Default: "latest".
   */
  model_version?: string;
};
