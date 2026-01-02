/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RetrievalSearchSelectOptionEnum } from './retrieval-search-select-option-enum.js';
/**
 * Representation of the 'RetrievalSearchDocumentKeyValueListPair' schema.
 */
export type RetrievalSearchDocumentKeyValueListPair = {
  /**
   * Max Length: 1024.
   */
  key: string;
  value: string[];
  /**
   * Select mode for search filters
   */
  selectMode?: RetrievalSearchSelectOptionEnum[];
} & Record<string, any>;
