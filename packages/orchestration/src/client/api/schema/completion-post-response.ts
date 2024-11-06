/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ModuleResults } from './module-results.js';
import type { LLMModuleResult } from './llm-module-result.js';
/**
 * Representation of the 'CompletionPostResponse' schema.
 */
export type CompletionPostResponse = {
  /**
   * ID of the request
   * @example "d4a67ea1-2bf9-4df7-8105-d48203ccff76"
   */
  request_id: string;
  module_results: ModuleResults;
  orchestration_result: LLMModuleResult;
} & Record<string, any>;
