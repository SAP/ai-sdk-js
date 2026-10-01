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
   * Content Media Type: "application/vnd.apache.parquet".
   */
  file: Blob;
  /**
   * JSON string containing the prediction configuration (see PredictionConfig schema).
   * @example "{\"target_columns\":[{\"name\": \"PRICE\",\"prediction_placeholder\": null,\"task_type\": \"regression\"}]}"
   * Content Media Type: "application/json".
   * Content Schema: {
   *   "$ref": "#/components/schemas/PredictionConfig"
   * }.
   */
  prediction_config: PredictionConfig;
  index_column?: string;
  parse_data_types?: boolean;
} & Record<string, any>;
