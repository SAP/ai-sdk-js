/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { TableUsage } from './table-usage.js';
/**
 * Size of the request, reproducible from the posted body. Meter on this.
 */
export type InputUsage = {
  X_train: TableUsage;
  y_train: TableUsage;
  X_test: TableUsage;
  n_estimators: number;
  num_cells: number;
  /**
   * One per test row, independent of how many values `output_type`
   * returns for each.
   */
  num_predictions: number;
};
