/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ClassifierConfig } from './classifier-config.js';
import type { RegressorConfig } from './regressor-config.js';
/**
 * The JSON carried in the `request` part of a multipart upload.
 */
export type PredictRequestConfig = {
  task_config:
    | ({ task: 'classification' } & ClassifierConfig)
    | ({ task: 'regression' } & RegressorConfig);
  /**
   * Preprocessing stages to run. `["preprocessing", "text"]` (default) is the full pipeline including text embeddings; `["preprocessing"]` skips text embeddings; `[]` hands the tables to the model as sent. Order is fixed and `"text"` needs `"preprocessing"`.
   * Default: [
   *   "preprocessing",
   *   "text"
   * ].
   */
  tabpfn_systems?: ('preprocessing' | 'text')[];
};
