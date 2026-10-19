/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { FitMode } from './fit-mode.js';
/**
 * Representation of the 'RegressorTabPFNConfigInput' schema.
 */
export type RegressorTabPFNConfigInput = {
  /**
   * Ensemble size: forward passes per prediction. Omit to let the model decide (8 for most data, more on very wide tables).
   */
  n_estimators?: number | null;
  /**
   * Zero-based column positions to treat as categorical. Omit to infer.
   */
  categorical_features_indices?: number[] | null;
  /**
   * Temperature applied to the output logits. Omit for the model default.
   */
  softmax_temperature?: number | null;
  /**
   * Average ensemble members before the softmax rather than after.
   */
  average_before_softmax?: boolean | null;
  /**
   * Seed for the ensemble's randomised preprocessing.
   */
  random_state?: number | null;
  /**
   * Advanced overrides of the model's inference configuration, passed through as given.
   */
  inference_config?: Record<string, any> | null;
  /**
   * Numeric precision of the forward pass.
   */
  inference_precision?: 'autocast' | 'auto' | null;
  /**
   * DISABLED in this container: sending a value other than the default is rejected with 422.
   * Default: true.
   */
  ignore_pretraining_limits?: boolean;
  /**
   * CPU workers used for per-estimator preprocessing.
   * Default: 4.
   */
  n_preprocessing_jobs?: number;
  /**
   * `fit_preprocessors` (default), `low_memory` and `batched` are served. `fit_with_cache` is rejected with 400: this container has no model cache.
   */
  fit_mode?: FitMode;
  /**
   * DISABLED in this container: sending it is rejected with 422.
   */
  device?: string[] | null;
  /**
   * Omit to let the container decide: off below 10,000 training rows, on from there.
   */
  memory_saving_mode?: boolean | null;
  /**
   * DISABLED in this container: only `null`, `"auto"` or `"default"` are accepted; anything else is rejected with 422. Select a model with the top-level `model_version` instead.
   */
  model_path?: string | null;
};
