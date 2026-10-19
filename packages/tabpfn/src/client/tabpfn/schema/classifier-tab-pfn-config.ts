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
  n_estimators?: number | null;
  categorical_features_indices?: number[] | null;
  softmax_temperature?: number | null;
  average_before_softmax?: boolean | null;
  random_state?: number | null;
  /**
   * Refer to tabpfn.inference_config.InferenceConfig for more details.
   */
  inference_config?: Record<string, any> | null;
  inference_precision?: 'autocast' | 'auto' | null;
  /**
   * Default: true.
   */
  ignore_pretraining_limits?: boolean;
  /**
   * Default: 4.
   */
  n_preprocessing_jobs?: number;
  fit_mode?: FitMode;
  /**
   * Stringified `torch.device`s
   */
  device?: string[] | null;
  memory_saving_mode?: boolean | null;
  model_path?: string | null;
  balance_probabilities?: boolean | null;
};
