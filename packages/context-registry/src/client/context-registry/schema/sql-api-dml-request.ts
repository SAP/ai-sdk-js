/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'SqlApiDmlRequest' schema.
 */
export type SqlApiDmlRequest = {
  /**
   * DML statement with named bind parameters (:name). Inline string literals are rejected.
   *
   * @example "INSERT INTO \"ORDERS\" (\"ORDER_ID\", \"CUSTOMER_ID\") VALUES (:id, :cid)"
   * Min Length: 1.
   */
  statement: string;
  /**
   * Named bind parameter values keyed by parameter name
   */
  parameters?: Record<string, any> | null;
} & Record<string, any>;
