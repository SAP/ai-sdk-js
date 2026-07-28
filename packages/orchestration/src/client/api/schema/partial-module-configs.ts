/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { PartialPromptTemplatingModuleConfig } from './partial-prompt-templating-module-config.js';
import type { FilteringModuleConfig } from './filtering-module-config.js';
import type { MaskingModuleConfig } from './masking-module-config.js';
import type { GroundingModuleConfig } from './grounding-module-config.js';
import type { TranslationModuleConfig } from './translation-module-config.js';
/**
 * Partial module configuration for use with config_ref overrides. All fields are optional so that only the modules that should be overridden need to be specified. The remaining configuration is taken from the referenced orchestration config.
 *
 */
export type PartialModuleConfigs = {
  prompt_templating?: PartialPromptTemplatingModuleConfig;
  filtering?: FilteringModuleConfig;
  masking?: MaskingModuleConfig;
  grounding?: GroundingModuleConfig;
  translation?: TranslationModuleConfig;
};
