/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TFMEnum } from './tfm-enum.js';
import type { ContextSelectionConfig } from './context-selection-config.js';
import type { PredictionConfig } from './prediction-config.js';
import type { ModelConfig } from './model-config.js';
import type { ColumnarData } from './columnar-data.js';
import type { RowData } from './row-data.js';
/**
 * Request schema for prediction endpoint.
 */
export type PredictRequest = {
  modelName: TFMEnum;
  /**
   * Scenario configuration identifier
   */
  scenarioConfigName: string;
  contextSelectionConfig?: ContextSelectionConfig;
  predictionConfig: PredictionConfig;
  modelConfig?: ModelConfig;
  /**
   * Query-only rows in columnar form. An object mapping from column name to array of column values.
   */
  columns?: ColumnarData | null;
  /**
   * (Optional) Context rows in columnar form, only relevant if 'columns' is provided. An object mapping from column name to array of column values.
   */
  contextColumns?: ColumnarData | null;
  /**
   * Query-only rows in row form. An array of objects representing table rows.
   */
  rows?: RowData | null;
  /**
   * (Optional) Context rows in row form, only relevant if 'rows' is provided. An array of objects representing table rows.
   */
  contextRows?: RowData | null;
} & Record<string, any>;
