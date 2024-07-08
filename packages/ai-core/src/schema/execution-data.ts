/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ExecutionId } from './execution-id.js';
import type { ConfigurationId } from './configuration-id.js';
import type { ConfigurationName } from './configuration-name.js';
import type { ScenarioId } from './scenario-id.js';
import type { ExecutionStatus } from './execution-status.js';
import type { ExecutionStatusMessage } from './execution-status-message.js';
import type { ArtifactArray } from './artifact-array.js';
import type { ExecutionScheduleId } from './execution-schedule-id.js';
/**
 * Execution that may generate artifacts
 */
export type ExecutionData = {
  id: ExecutionId;
  configurationId: ConfigurationId;
  configurationName?: ConfigurationName;
  scenarioId?: ScenarioId;
  /**
   * Target status of the execution
   * @example "STOPPED"
   */
  targetStatus?: 'COMPLETED' | 'RUNNING' | 'STOPPED' | 'DELETED.js';
  status: ExecutionStatus;
  statusMessage?: ExecutionStatusMessage;
  outputArtifacts?: ArtifactArray;
  executionScheduleId?: ExecutionScheduleId;
} & Record<string, any>;
