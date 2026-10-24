/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { PredictRequestConfig } from './predict-request-config.js';
/**
 * Representation of the 'PredictMultipart' schema.
 */
export type PredictMultipart = {
  /**
   * A plain form field (not a file) holding a `PredictRequestConfig` as a JSON string.
   * Content Media Type: "application/json".
   * Content Schema: {
   *   "$ref": "#/components/schemas/PredictRequestConfig"
   * }.
   */
  request: PredictRequestConfig;
  /**
   * CSV with a header row, or Parquet.
   * Format: "binary".
   */
  x_train: Blob;
  /**
   * CSV with a header row, or Parquet. Exactly one column.
   * Format: "binary".
   */
  y_train: Blob;
  /**
   * CSV with a header row, or Parquet.
   * Format: "binary".
   */
  x_test: Blob;
} & Record<string, any>;
