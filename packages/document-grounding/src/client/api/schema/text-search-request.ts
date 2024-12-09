/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { SearchFilter } from './search-filter.js';
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
  filters: SearchFilter[];
} & Record<string, any>;
