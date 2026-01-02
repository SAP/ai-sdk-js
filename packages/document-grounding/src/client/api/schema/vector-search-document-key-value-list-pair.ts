/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { VectorSearchSelectOptionEnum } from './vector-search-select-option-enum.js';
/**
 * Representation of the 'VectorSearchDocumentKeyValueListPair' schema.
 */
export type VectorSearchDocumentKeyValueListPair = {
  /**
   * Max Length: 1024.
   */
  key: string;
  value: string[];
  /**
   * Select mode for search filters
   */
  selectMode?: VectorSearchSelectOptionEnum[];
} & Record<string, any>;
