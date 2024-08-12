/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiScenarioLabelList } from './ai-scenario-label-list.js';
import type { AiScenarioId } from './ai-scenario-id.js';
/**
 * An ML Scenario consists of a number of executables. E.g., there can be one or several training executables, an inference (deployment) executable. An ML Scenario is versioned.
 *
 */
export type AiScenario = {
  /**
   * Name of the scenario
   * Max Length: 256.
   */
  name: string;
  /**
   * Description of the scenario
   * Max Length: 5000.
   */
  description?: string;
  labels?: AiScenarioLabelList;
  id: AiScenarioId;
  /**
   * Timestamp of resource creation
   * Format: "date-time".
   */
  createdAt: string;
  /**
   * Timestamp of latest resource modification
   * Format: "date-time".
   */
  modifiedAt: string;
} & Record<string, any>;
