/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RetrievalSearchFilter } from './retrieval-search-filter.js';
/**
 * Representation of the 'SearchInput' schema.
 */
export type SearchInput = {
  /**
   * Query string
   * Min Length: 1.
   */
  query: string;
  filters: RetrievalSearchFilter[];
} & Record<string, any>;
