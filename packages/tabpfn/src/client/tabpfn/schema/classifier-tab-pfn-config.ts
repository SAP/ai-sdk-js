/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { FitMode } from './fit-mode.js';
/**
 * Representation of the 'ClassifierTabPFNConfig' schema.
 */
export type ClassifierTabPFNConfig = {
  /**
   * Ensemble size. The model averages this number of forward passes, and each pass uses a different preprocessed view of the data. If unset, TabPFN selects the size. It selects 8 for most data. For wide tables, it selects more, so that each column gets to at least one ensemble member.
   */
  n_estimators?: number | null;
  /**
   * 0-based indices of the categorical columns. If unset, the model finds the categorical columns.
   */
  categorical_features_indices?: number[] | null;
  /**
   * A lower value makes the predicted probabilities more confident. The value 1.0 has no effect. If unset, the model uses its default value.
   */
  softmax_temperature?: number | null;
  /**
   * If true, the model averages the logits of the ensemble members before the softmax. If false, it averages their probabilities after the softmax. `auto` takes the setting of the checkpoint, as does unset. A true or false value cannot be combined with `AVERAGE_BEFORE_SOFTMAX` in `inference_config`.
   */
  average_before_softmax?: boolean | 'auto' | null;
  /**
   * Random seed. The same seed gives the same results. If unset, TabPFN uses its default seed.
   */
  random_state?: number | null;
  /**
   * Advanced inference settings. See `tabpfn.inference_config.InferenceConfig` in the TabPFN package.
   */
  inference_config?: Record<string, any> | null;
  /**
   * `autocast` always uses mixed precision. `auto` selects the precision from the hardware.
   */
  inference_precision?: 'autocast' | 'auto' | null;
  /**
   * Names of bundles of inference settings. `zero_inflated` is for regression targets with many exact zeros. The keys of `inference_config` win over every preset. If unset, the model uses the settings of its checkpoint.
   */
  presets?: 'zero_inflated' | 'zero_inflated'[] | null;
  /**
   * Number of worker processes for preprocessing.
   * Default: 4.
   */
  n_preprocessing_jobs?: number;
  /**
   * How the model prepares the fit.
   */
  fit_mode?: FitMode;
  /**
   * If true, the model divides parts of the computation into batches to use less memory. If unset, the model decides.
   */
  memory_saving_mode?: boolean | null;
  /**
   * If true, the model adjusts the probabilities for the class distribution of the training data. This can help with imbalanced classes when the metric ignores class imbalance, such as balanced accuracy.
   */
  balance_probabilities?: boolean | null;
};
