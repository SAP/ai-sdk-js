/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { VectorSearchFilter } from './vector-search-filter.js';
/**
 * Representation of the 'TextSearchRequest' schema.
 */
export type TextSearchRequest = {
  /**
   * Query string
   * Max Length: 2000.
   * Min Length: 1.
   */
  query: string;
  filters: VectorSearchFilter[];
} & Record<string, any>;
