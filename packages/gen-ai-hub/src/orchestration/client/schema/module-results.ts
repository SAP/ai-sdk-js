/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { GenericModuleResult } from './generic-module-result.js';
import type { TemplatingModuleResult } from './templating-module-result.js';
import type { LLMModuleResult } from './llm-module-result.js';
/**
 * Results of each module.
 */
export interface ModuleResults {
  grounding?: GenericModuleResult;
  templating?: TemplatingModuleResult;
  input_masking?: GenericModuleResult;
  input_filtering?: GenericModuleResult;
  llm?: LLMModuleResult;
  output_filtering?: GenericModuleResult;
  output_unmasking?: GenericModuleResult;
}
