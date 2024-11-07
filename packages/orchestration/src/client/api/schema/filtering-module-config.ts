/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { FilteringConfig } from './filtering-config.js';
import { InputFilteringConfig } from './input-filtering-config.js';
import { OutputFilteringConfig } from './output-filtering-config.js';
/**
 * Representation of the 'FilteringModuleConfig' schema.
 */
export interface FilteringModuleConfig {
  /**
   * List of provider type and filters.
   */
  input?: InputFilteringConfig;
  /**
   * List of provider type and filters.
   */
  output?: OutputFilteringConfig;
}
