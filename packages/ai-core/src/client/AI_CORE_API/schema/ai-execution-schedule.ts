/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiCron } from './ai-cron.js';
import type { AiConfigurationId } from './ai-configuration-id.js';
import type { AiExecutionScheduleId } from './ai-execution-schedule-id.js';
import type { AiExecutionScheduleStatus } from './ai-execution-schedule-status.js';
/**
 * Data about execution schedule
 */
export type AiExecutionSchedule = {
  cron: AiCron;
  /**
   * Name of the execution schedule
   * Max Length: 256.
   */
  name: string;
  configurationId: AiConfigurationId;
  /**
   * Timestamp, defining when the executions should start running periodically, defaults to now
   * Format: "date-time".
   */
  start?: string;
  /**
   * Timestamp, defining when the executions should stop running
   * Format: "date-time".
   */
  end?: string;
  id?: AiExecutionScheduleId;
  status?: AiExecutionScheduleStatus;
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
