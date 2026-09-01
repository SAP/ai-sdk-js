/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { PredictMetadata } from './predict-metadata.js';
import type { PredictStatus } from './predict-status.js';
/**
 * Response schema for prediction endpoint.
 *
 * Example response:
 * {
 *   "id": "8f15bafd-5fb8-4a35-bd2f-43c3b5887584",
 *   "metadata": {
 *     "num_columns": 5,
 *     "num_predictions": 1,
 *     "num_query_rows": 1,
 *     "num_rows": 3
 *   },
 *   "predictions": [
 *     {
 *       "category": [
 *         {
 *           "confidence": 0.71,
 *           "prediction": "Electronics"
 *         }
 *       ],
 *       "id": 4
 *     }
 *   ],
 *   "status": {
 *     "code": 0,
 *     "message": "ok"
 *   }
 * }
 */
export type PredictResponse = {
  id: string;
  metadata: PredictMetadata;
  predictions: Record<string, any>[];
  status: PredictStatus;
  /**
   * Warnings or informational messages from context selection
   * Default: [].
   */
  additional_information?: string[];
} & Record<string, any>;
