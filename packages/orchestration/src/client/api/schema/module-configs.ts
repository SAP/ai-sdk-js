/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { LlmModuleConfig } from './llm-module-config.js';
import type { TemplatingModuleConfig } from './templating-module-config.js';
import type { FilteringModuleConfig } from './filtering-module-config.js';
import type { MaskingModuleConfig } from './masking-module-config.js';
import type { GroundingModuleConfig } from './grounding-module-config.js';
import type { InputTranslationModuleConfig } from './input-translation-module-config.js';
import type { OutputTranslationModuleConfig } from './output-translation-module-config.js';
/**
 * Representation of the 'ModuleConfigs' schema.
 */
export type ModuleConfigs = {
  llm_module_config: LlmModuleConfig;
  templating_module_config: TemplatingModuleConfig;
  filtering_module_config?: FilteringModuleConfig;
  masking_module_config?: MaskingModuleConfig;
  grounding_module_config?: GroundingModuleConfig;
  input_translation_module_config?: InputTranslationModuleConfig;
  output_translation_module_config?: OutputTranslationModuleConfig;
};
