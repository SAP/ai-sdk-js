/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { SqlApiDdlRequest } from './sql-api-ddl-request.js';
/**
 * Representation of the 'SqlApiDdlBatchRequest' schema.
 */
export type SqlApiDdlBatchRequest = {
  /**
   * Min Items: 1.
   * Max Items: 100.
   */
  statements: SqlApiDdlRequest[];
  /**
   * Default: true.
   */
  stopOnError?: boolean;
} & Record<string, any>;
