/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ModuleResults } from './module-results.js';
import type { LLMModuleResultStreaming } from './llm-module-result-streaming.js';
/**
 * Representation of the 'CompletionPostResponseStreaming' schema.
 */
export type CompletionPostResponseStreaming = {
  /**
   * ID of the request
   */
  request_id: string;
  module_results?: ModuleResults;
  orchestration_result?: LLMModuleResultStreaming;
} & Record<string, any>;
