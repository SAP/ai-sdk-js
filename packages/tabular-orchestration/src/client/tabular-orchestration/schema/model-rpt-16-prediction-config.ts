/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ModelRpt15Explanations } from './model-rpt-15-explanations.js';
/**
 * Representation of the 'ModelRpt16PredictionConfig' schema.
 */
export type ModelRpt16PredictionConfig = {
  /**
   * (Optional) Configuration used to request explanations.
   */
  explanations?: ModelRpt15Explanations;
  /**
   * (Optional, default 'default') Only available for sap-rpt-1.6-large. Set to 'deep' for higher accuracy at higher latency when you have more than 8000 context rows. The value is passed through to the model, which validates the supported values.
   * Default: "default".
   */
  context_mode?: string;
} & Record<string, any>;
