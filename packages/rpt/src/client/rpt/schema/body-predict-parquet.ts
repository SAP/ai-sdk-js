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
   * Content Media Type: "application/vnd.apache.parquet".
   */
  file: Blob;
  /**
   * JSON string containing the prediction configuration (see PredictionConfig schema).
   * @example "{\"target_columns\":[{\"name\": \"PRICE\",\"prediction_placeholder\": null,\"task_type\": \"regression\"}]}"
   * Content Media Type: "application/json".
   */
  prediction_config: string;
  index_column?: string;
  parse_data_types?: boolean;
} & Record<string, any>;
