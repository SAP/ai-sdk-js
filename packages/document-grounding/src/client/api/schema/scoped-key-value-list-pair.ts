/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'ScopedKeyValueListPair' schema.
 */
export type ScopedKeyValueListPair = {
  /**
   * Max Length: 1024.
   */
  key: string;
  value: string[];
  /**
   * Default: "document".
   */
  scope?: 'repository' | 'document' | 'chunk';
} & Record<string, any>;
