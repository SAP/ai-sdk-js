/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ModuleResultsItem } from './module-results-item.js';
import type { LLMModuleOutput } from './llm-module-output.js';
/**
 * Representation of the 'CompletionPostResponse' schema.
 */
export type CompletionPostResponse = {
  /**
   * ID of the request.
   */
  request_id: string;
  /**
   * Results of each module. Only returned if return_module_results is true.
   */
  module_results?: ModuleResultsItem[];
  orchestration_result: LLMModuleOutput;
} & Record<string, any>;
