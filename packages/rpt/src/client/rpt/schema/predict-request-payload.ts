/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { PredictionConfig } from './prediction-config.js';
import type { SchemaFieldConfig } from './schema-field-config.js';
/**
 * Users need to specify a list of rows, which contains both the context rows
 * and the rows for which to predict a label, and a mapping of column names
 * to placeholder values. The model will predict the value for any column
 * specified in `predict_columns` for all rows that have the placeholder
 * value in that column.
 */
export type PredictRequestPayload = {
  prediction_config: PredictionConfig;
  /**
   * Table rows, i.e. list of objects where each object is a mapping of column names to values. Either "rows" or "columns" must be provided.
   */
  rows?: Record<string, string | number | number>[];
  /**
   * Alternative to rows: columns of data where each key is a column name and the value is a list of all column values. Either "rows" or "columns" must be provided.
   */
  columns?: Record<string, (string | number | number)[]> | null;
  /**
   * The name of the index column. If provided, the service will return this column's value in each prediction object to facilitate aligning the output predictions with the input rows on the client side. If not provided, the column will not be included in the output.
   */
  index_column?: string | null;
  /**
   * Whether to parse the data types of the columns. If set to True, numeric columns will be parsed to float or integer and dates in ISO format YYYY-MM-DD will be parsed.
   * Default: true.
   */
  parse_data_types?: boolean;
  /**
   * Optional schema defining the data types of each column. If provided, this will override automatic data type parsing.
   */
  data_schema?: Record<string, SchemaFieldConfig> | null;
};
