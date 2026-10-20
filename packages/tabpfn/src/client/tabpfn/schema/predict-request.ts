/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ClassifierConfig } from './classifier-config.js';
import type { PredictRequestContext } from './predict-request-context.js';
import type { RegressorConfig } from './regressor-config.js';
import type { Table } from './table.js';
import type { Target } from './target.js';
/**
 * `x_train` and `x_test` are accepted as aliases of `X_train` and `X_test`. Unknown top-level keys are rejected with 422.
 */
export type PredictRequest = {
  task_config:
    | ({ task: 'classification' } & ClassifierConfig)
    | ({ task: 'regression' } & RegressorConfig);
  /**
   * Model family to fit with. This image serves v3, v3.5; any other listed value is rejected with 400. Omit for v3.5.
   */
  model_version?: 'v2' | 'v2.5' | 'v2.6' | 'v3' | 'v3.5';
  /**
   * Preprocessing stages to run. `["preprocessing", "text"]` (default) is the full pipeline including text embeddings; `["preprocessing"]` skips text embeddings; `[]` hands the tables to the model as sent. Order is fixed and `"text"` needs `"preprocessing"`. `"thinking"` is rejected with 422.
   * Default: [
   *   "preprocessing",
   *   "text"
   * ].
   */
  tabpfn_systems?: ('preprocessing' | 'text' | 'thinking')[];
  /**
   * Accepted for compatibility. A non-null `model_id` without training data is rejected with 400.
   */
  context?: PredictRequestContext;
  X_train: Table;
  y_train: Target;
  /**
   * Same number of columns as `X_train`, in the same order.
   */
  X_test: Table;
};
