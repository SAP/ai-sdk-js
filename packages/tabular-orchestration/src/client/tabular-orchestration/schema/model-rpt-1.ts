/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * RPT1 Reference: https://help.sap.com/docs/sap-ai-core/generative-ai/example-payloads-for-inferencing-sap-rpt-1?locale=en-US#parameters
 */
export type ModelRpt1 = {
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
   * (Optional, RPT default: True) Relevant when data_schema isn't passed. Whether or not to parse data types, such as interpreting strings as numbers or dates.
   * Default: true.
   */
  parse_data_types?: boolean;
} & Record<string, any>;
