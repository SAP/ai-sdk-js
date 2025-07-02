/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { PromptTemplatingModuleConfig } from './prompt-templating-module-config.js';
import type { FilteringModuleConfig } from './filtering-module-config.js';
import type { MaskingModuleConfig } from './masking-module-config.js';
import type { GroundingModuleConfig } from './grounding-module-config.js';
import type { TranslationModuleConfig } from './translation-module-config.js';
/**
 * Representation of the 'ModuleConfigs' schema.
 */
export type ModuleConfigs = {
  prompt_templating: PromptTemplatingModuleConfig;
  filtering?: FilteringModuleConfig;
  masking?: MaskingModuleConfig;
  grounding?: GroundingModuleConfig;
  translation?: TranslationModuleConfig;
};
