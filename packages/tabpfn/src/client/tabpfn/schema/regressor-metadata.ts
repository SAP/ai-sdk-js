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
   * Number of rows that the model predicted.
   */
  test_set_num_rows: number;
  /**
   * Number of columns after encoding. This number can be different from the number of columns that you sent.
   */
  test_set_num_cols: number;
  /**
   * Ensemble size that the request used. Null when no ensemble ran.
   */
  n_estimators?: number | null;
  /**
   * The type of prediction.
   * Default: "regression".
   */
  task?: 'regression';
  /**
   * Version of the TabPFN package that made the prediction.
   */
  package_version: string;
  /**
   * The model settings that the request used.
   */
  tabpfn_config: RegressorTabPFNConfig;
};
