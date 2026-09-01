/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'SqlApiDdlBatchDeleteRequest' schema.
 */
export type SqlApiDdlBatchDeleteRequest = {
  /**
   * Min Items: 1.
   * Max Items: 100.
   */
  tableNames: string[];
  ifExists?: boolean;
  /**
   * Default: true.
   */
  stopOnError?: boolean;
} & Record<string, any>;
