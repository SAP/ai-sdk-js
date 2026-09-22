/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ContextSelectionStrategy } from './context-selection-strategy.js';
import type { Label } from './label.js';
import type { ScenarioConfigurationErrorMessage } from './scenario-configuration-error-message.js';
import type { ScenarioConfigurationStatus } from './scenario-configuration-status.js';
import type { TabularArtifactConfig } from './tabular-artifact-config.js';
/**
 * Representation of the 'ScenarioConfigurationObject' schema.
 */
export type ScenarioConfigurationObject = {
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
  contextSelectionStrategy?: ContextSelectionStrategy;
  /**
   * List of tabular artifacts
   */
  tabularArtifacts: TabularArtifactConfig[];
  /**
   * List of labels for the scenario configuration
   */
  labels?: Label[];
  status?: ScenarioConfigurationStatus;
  errorMessage?: ScenarioConfigurationErrorMessage;
  /**
   * @example "2024-02-15T12:45:00.000Z"
   * Format: "date-time".
   */
  createdAt: string;
  /**
   * @example "2024-02-15T12:45:00.000Z"
   * Format: "date-time".
   */
  updatedAt: string;
} & Record<string, any>;
