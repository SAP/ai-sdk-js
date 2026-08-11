/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { Template } from './template.js';
import type { TemplateRef } from './template-ref.js';
import type { LLMModelDetails } from './llm-model-details.js';
/**
 * Partial prompt templating configuration for use with config_ref overrides. model is optional so that only the prompt can be overridden without repeating the model config.
 *
 */
export type PartialPromptTemplatingModuleConfig = {
  /**
   * The prompt template to be used. Can be either a user defined template or a reference to a template in the prompt registry. If omitted, messages_history must be provided in the request body.
   *
   */
  prompt?: Template | TemplateRef;
  model?: LLMModelDetails;
};
