/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ChatMessages } from './chat-messages';
import type { GenericModuleResult } from './generic-module-result';
import type { LLMModuleResult } from './llm-module-result';
import type { LLMChoice } from './llm-choice';
import type { LLMChoiceStreaming } from './llm-choice-streaming';
/**
 * Results of each module.
 */
export type ModuleResults = {
  templating?: ChatMessages;
  input_masking?: GenericModuleResult;
  input_filtering?: GenericModuleResult;
  llm?: LLMModuleResult;
  output_filtering?: GenericModuleResult;
  output_unmasking?: (LLMChoice | LLMChoiceStreaming)[];
};
