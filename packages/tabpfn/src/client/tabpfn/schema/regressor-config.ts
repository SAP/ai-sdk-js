/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { RegressorPredictParams } from './regressor-predict-params.js';
import type { RegressorTabPFNConfig } from './regressor-tab-pfn-config.js';
/**
 * Representation of the 'RegressorConfig' schema.
 */
export type RegressorConfig = {
  /**
   * The type of prediction.
   * Default: "regression".
   */
  task?: 'regression';
  /**
   * Model settings for the fit.
   */
  tabpfn_config?: RegressorTabPFNConfig;
  /**
   * What the prediction returns.
   */
  predict_params?: RegressorPredictParams;
};
