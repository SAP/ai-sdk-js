/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataRepositorySearchResult } from './data-repository-search-result.js';
/**
 * Representation of the 'PerFilterSearchResult' schema.
 */
export type PerFilterSearchResult = {
  filterId: string;
  /**
   * List of returned results.
   * Default: [].
   */
  results?: DataRepositorySearchResult[];
} & Record<string, any>;
