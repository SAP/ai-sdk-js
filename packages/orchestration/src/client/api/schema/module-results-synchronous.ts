/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ModuleResultsBase } from './module-results-base.js';
import type { LLMModuleResultSynchronous } from './llm-module-result-synchronous.js';
import type { LlmChoice } from './llm-choice.js';
/**
 * Synchronous results of each module.
 */
export type ModuleResultsSynchronous = ModuleResultsBase & {
  llm?: LLMModuleResultSynchronous;
  output_unmasking?: LlmChoice[];
} & Record<string, any>;
