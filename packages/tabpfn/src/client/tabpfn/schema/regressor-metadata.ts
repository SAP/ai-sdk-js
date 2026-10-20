/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { RegressorTabPFNConfig } from './regressor-tab-pfn-config.js';
/**
 * Representation of the 'RegressorMetadata' schema.
 */
export type RegressorMetadata = {
  /**
   * Test rows the model saw.
   */
  test_set_num_rows: number;
  /**
   * Test columns the model saw, after encoding; differs from the request's width when columns are dropped or text columns expand.
   */
  test_set_num_cols: number;
  /**
   * Ensemble size the run used.
   */
  n_estimators?: number | null;
  /**
   * Default: "regression".
   */
  task?: 'regression';
  /**
   * Version of the TabPFN package that served the request.
   */
  package_version: string;
  /**
   * The configuration the run used. Settings the request left to the model are null; `device` and `model_path` carry what the container resolved.
   */
  tabpfn_config: RegressorTabPFNConfig;
};
