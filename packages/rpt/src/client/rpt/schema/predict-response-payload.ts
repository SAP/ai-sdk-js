/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { PredictResponseStatus } from './predict-response-status.js';
import type { PredictionResult } from './prediction-result.js';
import type { ExplanationResult } from './explanation-result.js';
import type { PredictResponseMetadata } from './predict-response-metadata.js';
/**
 * Response payload for prediction requests.
 * Contains a list of prediction results.
 */
export type PredictResponsePayload = {
  /**
   * Unique ID for the request.
   */
  id: string;
  /**
   * Status message that can indicate warnings (e.g. about suboptimal data).
   */
  status: PredictResponseStatus;
  /**
   * Mapping of column names to their list of prediction results or index column.
   */
  predictions: Record<string, PredictionResult[] | string | number>[];
  /**
   * Explanation data containing context row and column scores.
   */
  explanations?: ExplanationResult | null;
  metadata: PredictResponseMetadata;
};
