/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { PartialModuleConfigs } from './partial-module-configs.js';
import type { GlobalStreamOptions } from './global-stream-options.js';
/**
 * Partial orchestration configuration for use with config_ref overrides. All fields are optional so that only the parts that should be overridden need to be specified. The remaining configuration is taken from the referenced orchestration config.
 *
 */
export type PartialOrchestrationConfig = {
  modules?: PartialModuleConfigs;
  stream?: GlobalStreamOptions;
};
