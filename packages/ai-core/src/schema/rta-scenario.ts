/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RTAScenarioId } from './rta-scenario-id';
import type { RTALabelList } from './rta-label-list';
/**
 * Entity having labels
 */
export type RTAScenario = {
  id: RTAScenarioId;
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
  labels?: RTALabelList;
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
