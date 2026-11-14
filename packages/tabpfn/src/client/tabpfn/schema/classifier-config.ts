/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ClassifierPredictParams } from './classifier-predict-params.js';
import type { ClassifierTabPFNConfigInput } from './classifier-tab-pfn-config-input.js';
/**
 * Representation of the 'ClassifierConfig' schema.
 */
export type ClassifierConfig = {
  /**
   * Default: "classification".
   */
  task?: 'classification';
  tabpfn_config?: ClassifierTabPFNConfigInput;
  predict_params?: ClassifierPredictParams;
};
