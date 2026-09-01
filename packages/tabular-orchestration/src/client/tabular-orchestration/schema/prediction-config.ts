/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TargetColumn } from './target-column.js';
/**
 * Configuration for what to predict.
 *
 * Model-agnostic prediction config. Only contains fields shared across
 * all TFMs. Model-specific fields belong in `PredictRequest.modelConfig`.
 */
export type PredictionConfig = {
  /**
   * List of target columns with prediction configuration
   * Min Items: 1.
   */
  targetColumns: TargetColumn[];
};
