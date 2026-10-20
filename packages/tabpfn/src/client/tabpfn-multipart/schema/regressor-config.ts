/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { RegressorPredictParams } from './regressor-predict-params.js';
import type { RegressorTabPFNConfigInput } from './regressor-tab-pfn-config-input.js';
/**
 * Representation of the 'RegressorConfig' schema.
 */
export type RegressorConfig = {
  /**
   * Default: "regression".
   */
  task?: 'regression';
  tabpfn_config?: RegressorTabPFNConfigInput;
  predict_params?: RegressorPredictParams;
};
