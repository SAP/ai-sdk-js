/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { PredictionConfig } from './prediction-config.js';
/**
 * Representation of the 'BodyPredictParquet' schema.
 */
export type BodyPredictParquet = {
  /**
   * Parquet file containing the data
   * Format: "binary".
   */
  file: Blob;
  prediction_config: PredictionConfig;
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
