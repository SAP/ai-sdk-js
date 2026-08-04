/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ColumnType } from './column-type.js';
/**
 * Configuration for a single field in the input data schema.
 */
export type SchemaFieldConfig = {
  /**
   * The data type of the column. Supports base types (string, numeric, date) and extended types (e.g., Boolean, Integer, Timestamp). Extended types are mapped to corresponding base types internally. Case-insensitive.
   */
  dtype: ColumnType;
};
