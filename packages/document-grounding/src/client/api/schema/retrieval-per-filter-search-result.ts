/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RetrievalDataRepositorySearchResult } from './retrieval-data-repository-search-result.js';
/**
 * Representation of the 'RetrievalPerFilterSearchResult' schema.
 */
export type RetrievalPerFilterSearchResult = {
  filterId: string;
  /**
   * List of returned results.
   * Default: [].
   */
  results?: RetrievalDataRepositorySearchResult[];
} & Record<string, any>;
