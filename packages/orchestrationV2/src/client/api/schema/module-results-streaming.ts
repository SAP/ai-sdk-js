/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ModuleResultsBase } from './module-results-base.js';
import type { LLMModuleResultStreaming } from './llm-module-result-streaming.js';
import type { LlmChoiceStreaming } from './llm-choice-streaming.js';
/**
 * Streaming results of each module.
 */
export type ModuleResultsStreaming = ModuleResultsBase & {
  llm?: LLMModuleResultStreaming;
  output_unmasking?: LlmChoiceStreaming[];
} & Record<string, any>;
