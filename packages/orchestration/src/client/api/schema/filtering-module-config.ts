/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { InputFilteringConfig } from './input-filtering-config.js';
import type { OutputFilteringConfig } from './output-filtering-config.js';
/**
 * Representation of the 'FilteringModuleConfig' schema.
 */
export type FilteringModuleConfig = {
  /**
   * List of provider type and filters
   */
  input?: InputFilteringConfig;
  /**
   * List of provider type and filters
   */
  output?: OutputFilteringConfig;
};
