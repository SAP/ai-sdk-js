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
   * What `prediction` contains:
   *
   * * `mean`, `median` or `mode`: one value for each row.
   * * `quantiles`: one list for each quantile.
   * * `main`: the mean, median, mode and quantiles.
   * * `full`: the full predicted distribution. It accepts fewer rows.
   */
  output_type?: RegressorOutputType;
  /**
   * Quantile levels between 0 and 1, for `quantiles` and `main`. If unset, TabPFN uses its default list of 9 levels.
   */
  quantiles?: number[] | null;
};
