/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ColumnarData } from './columnar-data.js';
import type { ContextSelectionConfig } from './context-selection-config.js';
import type { ModelConfig } from './model-config.js';
import type { ModelRpt1 } from './model-rpt-1.js';
import type { ModelRpt15 } from './model-rpt-15.js';
import type { ModelRpt16 } from './model-rpt-16.js';
import type { PredictionConfig } from './prediction-config.js';
import type { RowData } from './row-data.js';
import type { TFMEnum } from './tfm-enum.js';
/**
 * Request schema for prediction endpoint.
 * @example {
 *   "columns": {
 *     "baseUnitOfMeasure": [
 *       "EA"
 *     ],
 *     "baseUnitOfMeasureCode": [
 *       "EA"
 *     ],
 *     "catalogId": [
 *       "default-source-catalog"
 *     ],
 *     "catalogVersion": [
 *       "Draft"
 *     ],
 *     "code": [
 *       "BK-211-M"
 *     ],
 *     "currency": [
 *       "USD"
 *     ],
 *     "division": [
 *       "[PREDICT]"
 *     ],
 *     "gtin": [
 *       ""
 *     ],
 *     "keywords": [
 *       "cycling,gloves,hands,grip,protection,comfort"
 *     ],
 *     "manufacturerAID": [
 *       "ACC-CSPW"
 *     ],
 *     "manufacturerName": [
 *       "Ritchey"
 *     ],
 *     "minQuantity": [
 *       1
 *     ],
 *     "name": [
 *       "BK Cycling Gloves - Size Medium"
 *     ],
 *     "price": [
 *       21.1
 *     ],
 *     "priceEndDate": [
 *       "31-12-2099"
 *     ],
 *     "priceStartDate": [
 *       "08-08-2025"
 *     ],
 *     "summary": [
 *       "Treat your hands to a comfortable pair of cycling gloves. Size medium."
 *     ],
 *     "superCategories": [
 *       "all-products:Draft:sample-b2c-usSalesCatalog,gear:Draft:sample-b2c-usSalesCatalog,weight-dimensions:Draft:sample-b2c-usSalesCatalog,all-products:Draft:sample-b2c-usSalesCatalog,gear:Draft:sample-b2c-usSalesCatalog,weight-dimensions:Draft:sample-b2c-usSalesCatalog,all-products:Draft:sample-b2c-usSalesCatalog,gear:Draft:sample-b2c-usSalesCatalog,weight-dimensions:Draft:sample-b2c-usSalesCatalog"
 *     ],
 *     "userPriceGroup": [
 *       ""
 *     ]
 *   },
 *   "contextSelectionConfig": {
 *     "strategy": "random"
 *   },
 *   "modelConfig": {
 *     "__notes__": "This is a sample sap-rpt-1.5 modelConfig",
 *     "data_schema": {
 *       "__notes__": "Available dtyes are: string, numeric, or date.",
 *       "baseUnitOfMeasure": {
 *         "dtype": "string"
 *       },
 *       "baseUnitOfMeasureCode": {
 *         "dtype": "string"
 *       },
 *       "catalogId": {
 *         "dtype": "string"
 *       },
 *       "catalogVersion": {
 *         "dtype": "string"
 *       },
 *       "code": {
 *         "dtype": "string"
 *       },
 *       "currency": {
 *         "dtype": "string"
 *       },
 *       "division": {
 *         "dtype": "string"
 *       },
 *       "gtin": {
 *         "dtype": "string"
 *       },
 *       "keywords": {
 *         "dtype": "string"
 *       },
 *       "manufacturerAID": {
 *         "dtype": "string"
 *       },
 *       "manufacturerName": {
 *         "dtype": "string"
 *       },
 *       "minQuantity": {
 *         "dtype": "numeric"
 *       },
 *       "name": {
 *         "dtype": "string"
 *       },
 *       "price": {
 *         "dtype": "numeric"
 *       },
 *       "priceEndDate": {
 *         "dtype": "date"
 *       },
 *       "priceStartDate": {
 *         "dtype": "date"
 *       },
 *       "summary": {
 *         "dtype": "string"
 *       },
 *       "superCategories": {
 *         "dtype": "string"
 *       },
 *       "userPriceGroup": {
 *         "dtype": "string"
 *       }
 *     },
 *     "index_column": "code",
 *     "prediction_config": {
 *       "explanations": {
 *         "top_column_scores": 3,
 *         "top_relevant_context_rows": 2
 *       }
 *     }
 *   },
 *   "modelName": "sap-rpt-1.5",
 *   "predictionConfig": {
 *     "targetColumns": [
 *       {
 *         "name": "division",
 *         "predictionPlaceholder": "[PREDICT]",
 *         "taskType": "classification"
 *       }
 *     ]
 *   },
 *   "scenarioConfigName": "sample_scenario_config"
 * }
 */
export type PredictRequest = {
  /**
   * Name of the deployed model
   */
  modelName: TFMEnum;
  /**
   * Scenario configuration identifier. Required to retrieve TabularArtifact, required to perform Context Selection.
   */
  scenarioConfigName?: string | null;
  /**
   * Context selection configuration
   */
  contextSelectionConfig?: ContextSelectionConfig;
  /**
   * Prediction configuration
   */
  predictionConfig: PredictionConfig;
  /**
   * (Optional) Any additional TFM-specific configurations that will be passed to the selected TFM.
   */
  modelConfig: ModelConfig | ModelRpt1 | ModelRpt15 | ModelRpt16;
  /**
   * Query-only rows in columnar form. An object mapping from column name to array of column values.
   */
  columns?: ColumnarData;
  /**
   * (Optional) Context rows in columnar form, only relevant if 'columns' is provided. An object mapping from column name to array of column values.
   */
  contextColumns?: ColumnarData;
  /**
   * Query-only rows in row form. An array of objects representing table rows.
   */
  rows?: RowData;
  /**
   * (Optional) Context rows in row form, only relevant if 'rows' is provided. An array of objects representing table rows.
   */
  contextRows?: RowData;
} & Record<string, any>;
