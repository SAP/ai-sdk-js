/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ContextSelectionStrategy } from './context-selection-strategy.js';
import type { Label } from './label.js';
import type { TabularArtifactConfig } from './tabular-artifact-config.js';
/**
 * Representation of the 'CreateScenarioConfiguration' schema.
 */
export type CreateScenarioConfiguration = {
  /**
   * Optional description text for the scenario configuration
   * @example "Production HR scenario for customer data analysis"
   * Max Length: 253.
   */
  description?: string | null;
  contextSelectionStrategy?: ContextSelectionStrategy;
  /**
   * List of tabular artifacts
   * Min Items: 1.
   */
  tabularArtifacts: TabularArtifactConfig[];
  /**
   * Optional labels for metadata tagging
   */
  labels?: Label[];
};
