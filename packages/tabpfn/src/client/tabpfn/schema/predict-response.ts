/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ClassifierMetadata } from './classifier-metadata.js';
import type { InputUsage } from './input-usage.js';
import type { RegressorMetadata } from './regressor-metadata.js';
/**
 * Representation of the 'PredictResponse' schema.
 */
export type PredictResponse = {
  /**
   * One entry per test row, shaped by `predict_params.output_type`.
   */
  prediction: any[] | any[][] | Record<string, any[] | any[][]>;
  /**
   * The settings that the request used.
   */
  metadata:
    | ({ task: 'classification' } & ClassifierMetadata)
    | ({ task: 'regression' } & RegressorMetadata);
  /**
   * What the request used. Use it for metering.
   */
  usage: InputUsage;
};
