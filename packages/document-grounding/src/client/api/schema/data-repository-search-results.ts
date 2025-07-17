/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataRepositoryPerFilterSearchResult } from './data-repository-per-filter-search-result.js';
import type { PerFilterSearchResultWithError } from './per-filter-search-result-with-error.js';
/**
 * Representation of the 'DataRepositorySearchResults' schema.
 */
export type DataRepositorySearchResults = {
  /**
   * List of returned results.
   */
  results: (
    | DataRepositoryPerFilterSearchResult
    | PerFilterSearchResultWithError
  )[];
} & Record<string, any>;
