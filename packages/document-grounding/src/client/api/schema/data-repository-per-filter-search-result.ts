/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataRepositorySearchResult } from './data-repository-search-result.js';
/**
 * Representation of the 'DataRepositoryPerFilterSearchResult' schema.
 */
export type DataRepositoryPerFilterSearchResult = {
  filterId: string;
  /**
   * List of returned results.
   * Default: [].
   */
  results?: DataRepositorySearchResult[];
} & Record<string, any>;
