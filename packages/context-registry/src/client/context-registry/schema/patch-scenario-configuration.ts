/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ContextSelectionStrategy } from './context-selection-strategy.js';
import type { Label } from './label.js';
import type { TabularArtifactConfig } from './tabular-artifact-config.js';
/**
 * Representation of the 'PatchScenarioConfiguration' schema.
 */
export type PatchScenarioConfiguration = {
  contextSelectionStrategy?: ContextSelectionStrategy;
  /**
   * Updated list of tabular artifacts
   * Min Items: 1.
   */
  tabularArtifacts?: TabularArtifactConfig[];
  /**
   * Updated labels (replaces all existing labels when provided)
   */
  labels?: Label[];
  /**
   * Optional description for the scenario configuration
   * Max Length: 253.
   */
  description?: string | null;
};
