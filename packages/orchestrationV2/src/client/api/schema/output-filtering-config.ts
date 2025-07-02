/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { OutputFilterConfig } from './output-filter-config.js';
import type { FilteringStreamOptions } from './filtering-stream-options.js';
/**
 * Representation of the 'OutputFilteringConfig' schema.
 */
export type OutputFilteringConfig = {
  /**
   * Configuration for content filtering services that should be used for the given filtering step (output filtering).
   * Min Items: 1.
   */
  filters: OutputFilterConfig[];
  stream_options?: FilteringStreamOptions;
};
