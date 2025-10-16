/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ModuleResultsStreaming } from './module-results-streaming.js';
import type { LLMModuleResultStreaming } from './llm-module-result-streaming.js';
import type { ErrorStreaming } from './error-streaming.js';
/**
 * Representation of the 'CompletionPostResponseStreaming' schema.
 */
export type CompletionPostResponseStreaming = {
  /**
   * ID of the request
   */
  request_id: string;
  intermediate_results?: ModuleResultsStreaming;
  final_result?: LLMModuleResultStreaming;
  /**
   * List of errors encountered during processing for unsuccessful modules configurations
   */
  intermediate_failures?: ErrorStreaming[];
} & Record<string, any>;
