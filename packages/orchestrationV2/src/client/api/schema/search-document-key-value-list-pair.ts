/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { SearchSelectOptionEnum } from './search-select-option-enum.js';
/**
 * Representation of the 'SearchDocumentKeyValueListPair' schema.
 */
export type SearchDocumentKeyValueListPair = {
  /**
   * Max Length: 1024.
   */
  key: string;
  value: string[];
  /**
   * Select mode for search filters
   */
  select_mode?: SearchSelectOptionEnum[];
};
