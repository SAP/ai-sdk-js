/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Metadata about the prediction request.
 */
export type PredictResponseMetadata = {
  /**
   * Number of columns in the input data.
   */
  num_columns: number;
  /**
   * Number of rows in the input data.
   */
  num_rows: number;
  /**
   * Number of table cells containing the specified placeholder value.
   */
  num_predictions: number;
  /**
   * Number of rows for which a prediction was made.
   */
  num_query_rows: number;
} & Record<string, any>;
