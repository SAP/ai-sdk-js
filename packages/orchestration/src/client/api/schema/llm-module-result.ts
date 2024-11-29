/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { LLMModuleResultSynchronous } from './llm-module-result-synchronous.js';
import type { LLMModuleResultStreaming } from './llm-module-result-streaming.js';
/**
 * Output of LLM module. Follows the OpenAI spec.
 */
export type LlmModuleResult =
  | LLMModuleResultSynchronous
  | LLMModuleResultStreaming;
