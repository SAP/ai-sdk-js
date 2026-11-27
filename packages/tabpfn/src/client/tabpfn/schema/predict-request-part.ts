/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ClassifierConfig } from './classifier-config.js';
import type { RegressorConfig } from './regressor-config.js';
/**
 * The fields of the JSON body, without `X_train`, `y_train` and `X_test`. Send the tables as file parts.
 */
export type PredictRequestPart = {
  /**
   * The task, model settings and output type.
   */
  task_config:
    | ({ task: 'classification' } & ClassifierConfig)
    | ({ task: 'regression' } & RegressorConfig);
  /**
   * The preparation steps that run on the tables before the model. With `[]`, the model gets the tables with only minimal cleaning.
   *
   * * `preprocessing` cleans and encodes the columns. On v4 it adds no character n-gram features and keeps every feature it generates.
   * * `text` embeds the text columns, as part of `preprocessing`.
   * Default: [
   *   "preprocessing",
   *   "text"
   * ].
   */
  tabpfn_systems?: ('preprocessing' | 'text')[];
  /**
   * How much each row of `X_train` counts in the fit, one value per row. Needs a model that takes weights, and a fit that the container does not keep.
   */
  sample_weight?: number[] | null;
  /**
   * How far to trust each target of `y_train`, one value in [0, 1] per row. Needs a model that takes weights, and a fit that the container does not keep.
   */
  label_reliability?: number[] | null;
};
