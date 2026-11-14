/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { RegressorOutputType } from './regressor-output-type.js';
/**
 * Representation of the 'RegressorPredictParams' schema.
 */
export type RegressorPredictParams = {
  /**
   * `mean`, `median`, `mode`: one number per test row. `quantiles`: one array per requested quantile. `main`: mean, median, mode and quantiles together. `full`: `main` plus the predicted distribution (`logits`, `borders`).
   */
  output_type?: RegressorOutputType;
  /**
   * Quantile levels in [0, 1]. Read by `quantiles`, `main` and `full`; ignored by the point output types. Omit for 0.1 … 0.9.
   */
  quantiles?: number[] | null;
};
