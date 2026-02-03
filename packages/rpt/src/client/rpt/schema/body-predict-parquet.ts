/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BodyPredictParquet' schema.
 */
export type BodyPredictParquet = {
  /**
   * Parquet file containing the data
   * Format: "binary".
   */
  file: string;
  /**
   * JSON string for prediction_config
   */
  prediction_config: string;
  /**
   * Optional index column name
   */
  index_column?: string;
  /**
   * Whether to parse data types
   * Default: true.
   */
  parse_data_types?: boolean;
} & Record<string, any>;
