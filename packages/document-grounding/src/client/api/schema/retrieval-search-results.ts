/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { RetrievalPerFilterSearchResultWithError } from './retrieval-per-filter-search-result-with-error.js';
import type { RetrievalPerFilterSearchResult } from './retrieval-per-filter-search-result.js';
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
