/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { CSNDefinition } from './csn-definition.js';
/**
 * Representation of the 'CreateTARequest' schema.
 */
export type CreateTARequest = {
  /**
   * Identifier for the target data destination
   * Max Length: 127.
   * Min Length: 1.
   */
  dataDestinationName: string;
  /**
   * Source file format
   * @example "CSV"
   */
  type: 'CSV' | 'PARQUET' | 'DELTA';
  /**
   * Absolute path to the data (must start with '/').
   * - For file-based artifacts (HDL, S3, GCS, AZURE): Standard file path (e.g., /data/customers.parquet)
   * - For Delta Sharing artifacts (DELTA_SHARING): Format /<share>/<schema>/<table> (e.g., /sample_data/tpch/customer)
   *
   * @example "/data/ingest/customer_data/file1.csv"
   * Pattern: "^\\/.*".
   */
  path: string;
  /**
   * Metadata of artifact in CSN format. For AUTO definition type, entityName is optional and will be derived from the file name if not provided.
   */
  csnMetadata: {
    /**
     * Name of the entity in CSN model. Required for DOCUMENT and REFERENCE types. Optional for AUTO type (defaults to file name without extension).
     */
    entityName?: string;
    /**
     * List of selected columns from the source file to be included in the TA
     * @example [
     *   "customer_id",
     *   "customer_name",
     *   "purchase_amount"
     * ]
     * Min Items: 1.
     */
    selectedColumns?: Set<string>;
    definition: CSNDefinition;
  };
};
