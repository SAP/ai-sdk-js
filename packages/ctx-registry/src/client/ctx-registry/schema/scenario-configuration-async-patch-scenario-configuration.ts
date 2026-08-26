import type { ScenarioConfigurationAsyncTabularArtifactConfig } from './scenario-configuration-async-tabular-artifact-config.js';
/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ScenarioConfigurationCommonContextSelectionStrategy } from './scenario-configuration-common-context-selection-strategy.js';
import type { ScenarioConfigurationCommonLabel } from './scenario-configuration-common-label.js';
/**
 * Representation of the 'ScenarioConfigurationAsyncPatchScenarioConfiguration' schema.
 */
export type ScenarioConfigurationAsyncPatchScenarioConfiguration = {
  contextSelectionStrategy?: ScenarioConfigurationCommonContextSelectionStrategy;
  /**
   * Updated list of tabular artifacts
   * Min Items: 1.
   */
  tabularArtifacts?: ScenarioConfigurationAsyncTabularArtifactConfig[];
  /**
   * Updated labels (replaces all existing labels when provided)
   */
  labels?: ScenarioConfigurationCommonLabel[];
  /**
   * Optional description for the scenario configuration
   * Max Length: 253.
   */
  description?: string | null;
};
