/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ModuleConfigs } from './module-configs.js';
import type { GlobalStreamOptions } from './global-stream-options.js';
/**
 * Representation of the 'OrchestrationConfig' schema.
 */
export type OrchestrationConfig = {
  module_configurations: ModuleConfigs;
  /**
   * If true, the response will be streamed back to the client
   */
  stream?: boolean;
  stream_options?: GlobalStreamOptions;
};
