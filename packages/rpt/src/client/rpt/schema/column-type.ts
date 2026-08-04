/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Supported column data types for the data schema.
 *
 * Includes base types (string, numeric, date) and additional types
 * derived from SAP CDS (https://cap.cloud.sap/docs/cds/types#core-built-in-types).
 * Additional types are mapped to the corresponding base type internally.
 * All values are lowercase for case-insensitive matching.
 */
export type ColumnType =
  | 'string'
  | 'numeric'
  | 'date'
  | 'boolean'
  | 'largestring'
  | 'uuid'
  | 'integer'
  | 'int16'
  | 'int32'
  | 'int64'
  | 'uint8'
  | 'decimal'
  | 'double'
  | 'time'
  | 'datetime'
  | 'timestamp';
