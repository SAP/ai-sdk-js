/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ClassifierMetadata } from './classifier-metadata.js';
import type { InputUsage } from './input-usage.js';
import type { Prediction } from './prediction.js';
import type { RegressorMetadata } from './regressor-metadata.js';
/**
 * Representation of the 'PredictResponse' schema.
 */
export type PredictResponse = {
  prediction: Prediction;
  metadata:
    | ({ task: 'classification' } & ClassifierMetadata)
    | ({ task: 'regression' } & RegressorMetadata);
  usage: InputUsage;
  /**
   * Always null in this container.
   */
  model_id?: string | null;
};
