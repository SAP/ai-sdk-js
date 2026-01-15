/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * A single prediction result for a single column in a single row.
 */
export type PredictionResult = {
  /**
   * The predicted value for the column.
   */
  prediction: string | number;
  /**
   * The confidence of the prediction (currently not provided).
   */
  confidence?: number | null;
} & Record<string, any>;
