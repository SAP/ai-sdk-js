/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ModelRpt16PredictionConfig } from './model-rpt-16-prediction-config.js';
/**
 * Representation of the 'ModelRpt16' schema.
 */
export type ModelRpt16 = {
  /**
   * (Optional) The name of the column used to identify the row. This column isn't used as an input feature for the model, and is returned in the response objects.
   */
  index_column?: string | null;
  /**
   * (Optional) A schema definition for data types of all columns. Possible values: string, numeric, or date.
   * @example {
   *   "data_schema": {
   *     "ORDERDATE": {
   *       "dtype": "date"
   *     },
   *     "PRICE": {
   *       "dtype": "numeric"
   *     },
   *     "PRODUCT": {
   *       "dtype": "string"
   *     }
   *   }
   * }
   */
  data_schema?: Record<string, Record<string, string>> | null;
  /**
   * (Optional, RPT Default: True) Relevant when data_schema isn't passed. Whether or not to parse data types, such as interpreting strings as numbers or dates.
   * Default: true.
   */
  parse_data_types?: boolean;
  /**
   * (Optional) An object for configuring predictions.
   */
  prediction_config?: ModelRpt16PredictionConfig;
} & Record<string, any>;
