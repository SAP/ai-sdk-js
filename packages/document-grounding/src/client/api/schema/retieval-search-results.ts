/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RetievalPerFilterSearchResult } from './retieval-per-filter-search-result.js';
import type { RetievalPerFilterSearchResultWithError } from './retieval-per-filter-search-result-with-error.js';
/**
 * Representation of the 'RetievalSearchResults' schema.
 */
export type RetievalSearchResults = {
  /**
   * List of returned results.
   */
  results: (
    | RetievalPerFilterSearchResult
    | RetievalPerFilterSearchResultWithError
  )[];
} & Record<string, any>;
