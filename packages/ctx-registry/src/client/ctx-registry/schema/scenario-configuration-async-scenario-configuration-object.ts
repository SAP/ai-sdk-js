/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ScenarioConfigurationCommonContextSelectionStrategy } from './scenario-configuration-common-context-selection-strategy.js';
import type { ScenarioConfigurationAsyncTabularArtifactConfig } from './scenario-configuration-async-tabular-artifact-config.js';
import type { ScenarioConfigurationCommonLabel } from './scenario-configuration-common-label.js';
import type { ScenarioConfigurationAsyncScenarioConfigurationStatus } from './scenario-configuration-async-scenario-configuration-status.js';
import type { ScenarioConfigurationAsyncScenarioConfigurationErrorMessage } from './scenario-configuration-async-scenario-configuration-error-message.js';
/**
 * Representation of the 'ScenarioConfigurationAsyncScenarioConfigurationObject' schema.
 */
export type ScenarioConfigurationAsyncScenarioConfigurationObject = {
  /**
   * Name of the scenario configuration
   * @example "scm-bdc-def-v2"
   */
  name: string;
  /**
   * Optional description text
   * @example "Production BDC scenario for customer data analysis"
   */
  description?: string | null;
  contextSelectionStrategy?: ScenarioConfigurationCommonContextSelectionStrategy;
  /**
   * List of tabular artifacts
   */
  tabularArtifacts: ScenarioConfigurationAsyncTabularArtifactConfig[];
  /**
   * List of labels for the scenario configuration
   */
  labels?: ScenarioConfigurationCommonLabel[];
  status?: ScenarioConfigurationAsyncScenarioConfigurationStatus;
  errorMessage?: ScenarioConfigurationAsyncScenarioConfigurationErrorMessage;
  /**
   * @example "2024-02-15T12:45:00.000Z"
   * Pattern: "^$|^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,6})?Z$".
   */
  createdAt: string;
  /**
   * @example "2024-02-15T12:45:00.000Z"
   * Pattern: "^$|^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,6})?Z$".
   */
  updatedAt: string;
} & Record<string, any>;
