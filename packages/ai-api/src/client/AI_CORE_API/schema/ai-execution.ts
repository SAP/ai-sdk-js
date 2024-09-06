/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiExecutionId } from './ai-execution-id.js';
import type { AiConfigurationId } from './ai-configuration-id.js';
import type { AiConfigurationName } from './ai-configuration-name.js';
import type { AiScenarioId } from './ai-scenario-id.js';
import type { AiExecutionStatus } from './ai-execution-status.js';
import type { AiExecutionStatusMessage } from './ai-execution-status-message.js';
import type { AiArtifactArray } from './ai-artifact-array.js';
import type { AiExecutionScheduleId } from './ai-execution-schedule-id.js';
/**
 * Execution that may generate artifacts
 */
export type AiExecution = {
  id: AiExecutionId;
  configurationId: AiConfigurationId;
  configurationName?: AiConfigurationName;
  scenarioId?: AiScenarioId;
  /**
   * Target status of the execution
   * @example "STOPPED"
   */
  targetStatus?: 'COMPLETED' | 'RUNNING' | 'STOPPED' | 'DELETED';
  status: AiExecutionStatus;
  statusMessage?: AiExecutionStatusMessage;
  outputArtifacts?: AiArtifactArray;
  executionScheduleId?: AiExecutionScheduleId;
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
  /**
   * Timestamp of job submitted
   * Format: "date-time".
   */
  submissionTime?: string;
  /**
   * Timestamp of job status changed to RUNNING
   * Format: "date-time".
   */
  startTime?: string;
  /**
   * Timestamp of job status changed to COMPLETED/DEAD/STOPPED
   * Format: "date-time".
   */
  completionTime?: string;
} & Record<string, any>;
