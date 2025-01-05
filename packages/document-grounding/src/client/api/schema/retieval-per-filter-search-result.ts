/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RetievalDataRepositorySearchResult } from './retieval-data-repository-search-result.js';
/**
 * Representation of the 'RetievalPerFilterSearchResult' schema.
 */
export type RetievalPerFilterSearchResult = {
  filterId: string;
  /**
   * List of returned results.
   * Default: [].
   */
  results?: RetievalDataRepositorySearchResult[];
} & Record<string, any>;
