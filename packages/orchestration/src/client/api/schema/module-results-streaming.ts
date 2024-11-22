/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ModuleResults } from './module-results.js';
import type { LLMModuleResultStreaming } from './llm-module-result-streaming.js';
import type { LLMChoiceStreaming } from './llm-choice-streaming.js';
/**
 * Streaming results of each module.
 */
export type ModuleResultsStreaming = ModuleResults & {
  llm?: LLMModuleResultStreaming;
  output_unmasking?: LLMChoiceStreaming[];
} & Record<string, any>;
