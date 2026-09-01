/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'SqlApiQueryRequest' schema.
 */
export type SqlApiQueryRequest = {
  /**
   * SELECT statement (or WITH … SELECT CTE) with named bind parameters.
   *
   * @example "SELECT * FROM \"ORDERS\" WHERE \"CUSTOMER_ID\" = :cid"
   * Min Length: 1.
   */
  statement: string;
  /**
   * Named bind parameter values
   */
  parameters?: Record<string, any> | null;
  /**
   * Hard cap on rows returned (single-shot or paginated)
   * Default: 10000.
   * Minimum: 1.
   */
  maxRows?: number;
  /**
   * Rows per page.  Omit for single-shot mode.
   * Maximum: 5000.
   * Minimum: 1.
   */
  top?: number | null;
  /**
   * Row offset (used with top for pagination)
   */
  skip?: number;
  /**
   * Default: 30.
   * Maximum: 300.
   * Minimum: 1.
   */
  timeoutSeconds?: number;
} & Record<string, any>;
