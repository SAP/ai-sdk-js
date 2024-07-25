/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TemplatingModuleResult } from './templating-module-result.js';
import type { LLMModuleResult } from './llm-module-result.js';
import { GenericModuleResult } from './generic-module-result.js';
/**
 * Results of each module.
 */
export interface ModuleResults {
  /**
   * Results of the templating module.
   */
  templating?: TemplatingModuleResult;
  /**
   * Results of the LLM module.
   */
  llm?: LLMModuleResult;
  /**
   * Results of the input filtering module.
   */
  input_filtering?: GenericModuleResult;
  /**
   * Results of the output filtering module.
   */
  output_filtering?: GenericModuleResult;
}
