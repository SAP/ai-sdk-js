/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'SqlApiDdlRequest' schema.
 */
export type SqlApiDdlRequest = {
  /**
   * DDL statement to execute.  Schema-level operations are rejected.
   *
   * @example "CREATE COLUMN TABLE \"ORDERS\" (\"ORDER_ID\" NVARCHAR(36) NOT NULL PRIMARY KEY)"
   * Min Length: 1.
   */
  statement: string;
} & Record<string, any>;
