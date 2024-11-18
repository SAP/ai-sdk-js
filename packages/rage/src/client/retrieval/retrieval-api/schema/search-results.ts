/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { PerFilterSearchResult } from './per-filter-search-result.js';
import type { PerFilterSearchResultWithError } from './per-filter-search-result-with-error.js';
/**
 * Representation of the 'SearchResults' schema.
 */
export type SearchResults = {
  /**
   * List of returned results.
   */
  results: (PerFilterSearchResult | PerFilterSearchResultWithError)[];
} & Record<string, any>;
