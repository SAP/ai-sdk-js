/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ClassifierTabPFNConfig } from './classifier-tab-pfn-config.js';
/**
 * Representation of the 'ClassifierMetadata' schema.
 */
export type ClassifierMetadata = {
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
   * Default: "classification".
   */
  task?: 'classification';
  /**
   * Version of the TabPFN package that made the prediction.
   */
  package_version: string;
  /**
   * The model settings that the request used.
   */
  tabpfn_config: ClassifierTabPFNConfig;
  /**
   * Class labels in ascending order. They name the columns of `probas` and the labels of `preds`. Null with `top_k`, because `top_k` has its own `prediction.classes`.
   */
  classes?: (string | number | number | boolean)[] | null;
  /**
   * The `top_k` value of the request.
   */
  top_k?: number | null;
};
