/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ModuleResults } from './module-results.js';
import type { LlmModuleResult } from './llm-module-result.js';
import type { Error } from './error.js';
/**
 * Representation of the 'CompletionPostResponse' schema.
 */
export type CompletionPostResponse = {
  /**
   * ID of the request
   * @example "d4a67ea1-2bf9-4df7-8105-d48203ccff76"
   */
  request_id: string;
  intermediate_results: ModuleResults;
  final_result: LlmModuleResult;
  /**
   * List of errors encountered during processing for unsuccessful modules configurations
   */
  intermediate_failures?: Error[];
} & Record<string, any>;
