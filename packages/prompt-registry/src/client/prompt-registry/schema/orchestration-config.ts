/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ModuleConfigs } from './module-configs.js';
import type { ModuleConfigsList } from './module-configs-list.js';
import type { GlobalStreamOptions } from './global-stream-options.js';
/**
 * Representation of the 'OrchestrationConfig' schema.
 */
export type OrchestrationConfig = {
  modules: ModuleConfigs | ModuleConfigsList;
  stream?: GlobalStreamOptions;
};
