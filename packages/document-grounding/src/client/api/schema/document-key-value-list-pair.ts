/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'DocumentKeyValueListPair' schema.
 */
export type DocumentKeyValueListPair = {
  /**
   * Max Length: 1024.
   */
  key: string;
  value: string[];
  /**
   * Default match mode for search filters
   * Default: "ANY".
   */
  matchMode?: 'ANY' | 'ALL' | any | Record<string, any>;
} & Record<string, any>;
