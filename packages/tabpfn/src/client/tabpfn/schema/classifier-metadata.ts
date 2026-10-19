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
   * Default: "classification".
   */
  task?: 'classification';
  /**
   * Version of the TabPFN package that served the request.
   */
  package_version: string;
  /**
   * The configuration the run used. Settings the request left to the model are null; `device` and `model_path` carry what the container resolved.
   */
  tabpfn_config: ClassifierTabPFNConfig;
  /**
   * Class labels in ascending order, original type. The column axis of `probas`. Null for `top_k`, where the list travels in `prediction.classes` instead.
   */
  classes?: (string | number | number | boolean)[] | null;
  /**
   * The request's `top_k`, else null.
   */
  top_k?: number | null;
};
