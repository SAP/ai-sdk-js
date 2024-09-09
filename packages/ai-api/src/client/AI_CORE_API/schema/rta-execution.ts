/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RTAScenarioId } from './rta-scenario-id.js';
import type { RTAExecutableId } from './rta-executable-id.js';
import type { RTAExecutionId } from './rta-execution-id.js';
/**
 * Execution
 */
export type RTAExecution = {
  scenarioId: RTAScenarioId;
  executableId: RTAExecutableId;
  id?: RTAExecutionId;
  /**
   * Status of the execution
   * @example "COMPLETED"
   */
  status?:
    | 'PENDING'
    | 'RUNNING'
    | 'COMPLETED'
    | 'DEAD'
    | 'STOPPING'
    | 'STOPPED'
    | 'UNKNOWN';
  /**
   * Execution status message
   * Max Length: 256.
   */
  statusMessage?: string;
  /**
   * Timestamp of execution submission
   * @example "2017-09-15T12:01:06Z"
   * Format: "date-time".
   */
  submissionTimestamp?: string;
  /**
   * Timestamp of execution start
   * @example "2017-09-15T12:01:06Z"
   * Format: "date-time".
   */
  startTimestamp?: string;
  /**
   * Timestamp of execution finish
   * @example "2017-09-15T12:01:06Z"
   * Format: "date-time".
   */
  finishTimestamp?: string;
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
