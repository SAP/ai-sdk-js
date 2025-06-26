/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ModuleResultsStreaming } from './module-results-streaming.js';
/**
 * Representation of the 'ErrorResponseStreaming' schema.
 */
export type ErrorResponseStreaming = {
  /**
   * @example "d4a67ea1-2bf9-4df7-8105-d48203ccff76"
   */
  request_id: string;
  /**
   * @example 500
   */
  code: number;
  /**
   * @example "Model name must be one of ['gpt-4o-mini', ...]"
   */
  message: string;
  /**
   * Where the error occurred
   * @example "LLM Module"
   */
  location: string;
  module_results?: ModuleResultsStreaming;
} & Record<string, any>;
