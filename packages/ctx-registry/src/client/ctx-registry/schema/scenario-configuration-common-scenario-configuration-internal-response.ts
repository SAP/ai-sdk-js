/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ScenarioConfigurationCommonContextSelectionStrategy } from './scenario-configuration-common-context-selection-strategy.js';
import type { ScenarioConfigurationCommonLabel } from './scenario-configuration-common-label.js';
import type { ScenarioConfigurationCommonTabularArtifactsContainer } from './scenario-configuration-common-tabular-artifacts-container.js';
/**
 * Representation of the 'ScenarioConfigurationCommonScenarioConfigurationInternalResponse' schema.
 */
export type ScenarioConfigurationCommonScenarioConfigurationInternalResponse = {
  /**
   * Name of the Scenario Configuration
   * @example "scenario_name"
   */
  name: string;
  /**
   * Optional description text
   * @example "Production scenario for analytics"
   */
  description?: string | null;
  contextSelectionStrategy?: ScenarioConfigurationCommonContextSelectionStrategy;
  tabularArtifacts: ScenarioConfigurationCommonTabularArtifactsContainer;
  /**
   * List of labels
   */
  labels?: ScenarioConfigurationCommonLabel[];
  /**
   * @example "2024-02-15T12:45:00.000Z"
   * Format: "date-time".
   */
  createdAt?: string;
  /**
   * @example "2024-02-15T12:45:00.000Z"
   * Format: "date-time".
   */
  updatedAt?: string;
};
