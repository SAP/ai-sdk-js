/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { GenericModuleResult } from './generic-module-result.js';
import type { TemplatingChatMessage } from './templating-chat-message.js';
import type { LlmModuleResult } from './llm-module-result.js';
import type { LlmChoice } from './llm-choice.js';
import type { LLMChoiceStreaming } from './llm-choice-streaming.js';
/**
 * Results of each module.
 */
export type ModuleResults = {
  grounding?: GenericModuleResult;
  templating?: TemplatingChatMessage;
  input_masking?: GenericModuleResult;
  input_filtering?: GenericModuleResult;
  llm?: LlmModuleResult;
  output_filtering?: GenericModuleResult;
  output_unmasking?: (LlmChoice | LLMChoiceStreaming)[];
};
