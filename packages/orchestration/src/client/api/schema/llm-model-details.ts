/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * The model and parameters to be used for the prompt templating. This is the model that will be used to generate the response.
 *
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
  /**
   * Timeout for the LLM request in seconds. This parameter is currently ignored for Vertex AI models.
   * Default: 600.
   * Maximum: 600.
   * Minimum: 1.
   */
  timeout?: number;
  /**
   * Maximum number of retries for the LLM request. This parameter is currently ignored for Vertex AI models.
   * Default: 2.
   * Maximum: 5.
   */
  max_retries?: number;
};
