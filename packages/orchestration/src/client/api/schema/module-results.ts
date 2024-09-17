/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { GenericModuleResult } from './generic-module-result.js';
import type { ChatMessages } from './chat-messages.js';
import type { LlmModuleResult } from './llm-module-result.js';
import type { LlmChoice } from './llm-choice.js';
/**
 * Results of each module.
 */
export interface ModuleResults {
  grounding?: GenericModuleResult;
  templating?: ChatMessages;
  input_masking?: GenericModuleResult;
  input_filtering?: GenericModuleResult;
  llm?: LlmModuleResult;
  output_filtering?: GenericModuleResult;
  output_unmasking?: LlmChoice[];
}
