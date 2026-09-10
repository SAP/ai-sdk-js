/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ExplanationConfig } from './explanation-config.js';
import type { TargetColumnConfig } from './target-column-config.js';
/**
 * Configuration of the prediction model.
 */
export type PredictionConfig = {
  target_columns: TargetColumnConfig[];
  /**
   * Context mode for predictions. Set it to "default" for the best balance between accuracy and latency/cost. Set it to "deep" for higher accuracy with >8k context rows at increased latency and cost (only for "sap-rpt-1.6-large").
   * Default: "default".
   */
  context_mode?: 'default' | 'deep';
  /**
   * Optional configuration for explainability outputs (column scores and relevant context rows).
   */
  explanations?: ExplanationConfig;
};
