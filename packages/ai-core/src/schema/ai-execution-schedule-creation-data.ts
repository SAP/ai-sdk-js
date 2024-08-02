/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiCron } from './ai-cron';
import type { AiConfigurationId } from './ai-configuration-id';
/**
 * Start and end an execution schedule.
 */
export type AiExecutionScheduleCreationData = {
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
} & Record<string, any>;
