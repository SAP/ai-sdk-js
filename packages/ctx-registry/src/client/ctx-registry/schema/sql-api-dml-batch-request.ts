/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { SqlApiDmlBatchItem } from './sql-api-dml-batch-item.js';
/**
 * Representation of the 'SqlApiDmlBatchRequest' schema.
 */
export type SqlApiDmlBatchRequest = {
  /**
   * Min Items: 1.
   * Max Items: 100.
   */
  statements: SqlApiDmlBatchItem[];
  /**
   * When true (default) all statements run in one HANA transaction. When false each statement is auto-committed independently.
   *
   * Default: true.
   */
  transaction?: boolean;
} & Record<string, any>;
