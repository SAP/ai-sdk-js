/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { LLMModuleConfig } from './llm-module-config.js';
import type { TemplatingModuleConfig } from './templating-module-config.js';
import type { FilteringModuleConfig } from './filtering-module-config.js';
/**
 * Representation of the 'ModuleConfigs' schema.
 */
export type ModuleConfigs = {
  llm_module_config: LLMModuleConfig;
  templating_module_config: TemplatingModuleConfig;
  filtering_module_config?: FilteringModuleConfig;
} & Record<string, any>;
