/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'LLMModelDetails' schema.
 */
export type LLMModelDetails = {
  /**
   * Name of the model as in LLM Access configuration
   * @example "gpt-4o-mini"
   */
  name: string;
  /**
   * Version of the model to be used
   * Default: "latest".
   */
  version?: string;
  /**
   * Additional parameters for the model. Default values are used for mandatory parameters.
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
  params?: Record<string, any>;
};
