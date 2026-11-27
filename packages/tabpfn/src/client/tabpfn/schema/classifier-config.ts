/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ClassifierPredictParams } from './classifier-predict-params.js';
import type { ClassifierTabPFNConfig } from './classifier-tab-pfn-config.js';
/**
 * Representation of the 'ClassifierConfig' schema.
 */
export type ClassifierConfig = {
  /**
   * The type of prediction.
   * Default: "classification".
   */
  task?: 'classification';
  /**
   * Model settings for the fit.
   */
  tabpfn_config?: ClassifierTabPFNConfig;
  /**
   * What the prediction returns.
   */
  predict_params?: ClassifierPredictParams;
};
