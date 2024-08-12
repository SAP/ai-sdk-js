/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { FilterConfig } from './filter-config.js';
/**
 * Representation of the 'FilteringConfig' schema.
 */
export type FilteringConfig = {
  /**
   * Configuration for content filtering services that should be used for the given filtering step (input filtering or output filtering).
   * Min Items: 1.
   */
  filters: FilterConfig[];
} & Record<string, any>;
