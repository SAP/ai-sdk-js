/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { Template } from './template.js';
import type { TemplateRef } from './template-ref.js';
import type { LLMModelDetails } from './llm-model-details.js';
/**
 * Representation of the 'PromptTemplatingModuleConfig' schema.
 */
export type PromptTemplatingModuleConfig = {
  /**
   * The prompt template to be used. Can be either a user defined template or a reference to a template in the prompt registry.
   *
   */
  prompt: Template | TemplateRef;
  model: LLMModelDetails;
  /**
   * Timeout for the LLM request in seconds. This parameter will be ignored for Vertex AI models. Support for Vertex AI models will be added in the future.
   * Default: 600.
   * Maximum: 600.
   * Minimum: 1.
   */
  timeout?: number;
  /**
   * Maximum number of retries for the LLM request. This parameter will be ignored for Vertex AI models. Support for Vertex AI models will be added in the future.
   * Default: 2.
   * Maximum: 10.
   */
  max_retries?: number;
};
