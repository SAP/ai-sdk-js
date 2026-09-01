import type { ScenarioConfigurationAsyncTabularArtifactConfig } from './scenario-configuration-async-tabular-artifact-config.js';
/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ScenarioConfigurationCommonContextSelectionStrategy } from './scenario-configuration-common-context-selection-strategy.js';
import type { ScenarioConfigurationCommonLabel } from './scenario-configuration-common-label.js';
/**
 * Representation of the 'ScenarioConfigurationAsyncCreateScenarioConfiguration' schema.
 */
export type ScenarioConfigurationAsyncCreateScenarioConfiguration = {
  /**
   * Optional description text for the scenario configuration
   * @example "Production HR scenario for customer data analysis"
   * Max Length: 253.
   */
  description?: string | null;
  contextSelectionStrategy?: ScenarioConfigurationCommonContextSelectionStrategy;
  /**
   * List of tabular artifacts
   * Min Items: 1.
   */
  tabularArtifacts: ScenarioConfigurationAsyncTabularArtifactConfig[];
  /**
   * Optional labels for metadata tagging
   */
  labels?: ScenarioConfigurationCommonLabel[];
};
