/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { FilterMatchModeEnum } from './filter-match-mode-enum.js';
/**
 * Representation of the 'VectorDocumentKeyValueListPair' schema.
 */
export type VectorDocumentKeyValueListPair = {
  /**
   * Max Length: 1024.
   */
  key: string;
  value: string[];
  matchMode?: FilterMatchModeEnum;
} & Record<string, any>;
