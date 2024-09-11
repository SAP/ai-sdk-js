/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiCron } from './ai-cron.js';
import type { AiConfigurationId } from './ai-configuration-id.js';
import type { AiExecutionScheduleStatus } from './ai-execution-schedule-status.js';
/**
 * Request object for changing the execution schedule
 */
export type AiExecutionScheduleModificationRequest = {
  cron?: AiCron;
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
  configurationId?: AiConfigurationId;
  status?: AiExecutionScheduleStatus;
} & Record<string, any>;
