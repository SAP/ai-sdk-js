/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RetrievalPerFilterSearchResult } from './retrieval-per-filter-search-result.js';
import type { RetrievalPerFilterSearchResultWithError } from './retrieval-per-filter-search-result-with-error.js';
/**
 * Representation of the 'RetrievalSearchResults' schema.
 */
export type RetrievalSearchResults = {
  /**
   * List of returned results.
   */
  results: (
    | RetrievalPerFilterSearchResult
    | RetrievalPerFilterSearchResultWithError
  )[];
} & Record<string, any>;
