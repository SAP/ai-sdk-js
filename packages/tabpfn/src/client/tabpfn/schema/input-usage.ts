/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { TableUsage } from './table-usage.js';
/**
 * What the request used. Use it for metering.
 *
 * The counts are for the tables as you sent them, before preprocessing. You can
 * calculate each count from the request body. `metadata.test_set_num_cols` is
 * different: it is the width after encoding.
 */
export type InputUsage = {
  /**
   * Shape of `X_train` as you sent it. Zero when the request has no training data.
   */
  X_train: TableUsage;
  /**
   * Shape of `y_train` as you sent it. Zero when the request has no training data.
   */
  y_train: TableUsage;
  /**
   * Shape of `X_test` as you sent it.
   */
  X_test: TableUsage;
  /**
   * Ensemble size that the request used. Never null.
   */
  n_estimators: number;
  /**
   * Total number of cells in the three tables.
   */
  num_cells: number;
  /**
   * One for each test row. The `output_type` does not change this number.
   */
  num_predictions: number;
};
