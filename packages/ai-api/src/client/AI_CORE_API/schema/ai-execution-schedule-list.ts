/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiExecutionSchedule } from './ai-execution-schedule.js';
/**
 * Representation of the 'AiExecutionScheduleList' schema.
 */
export type AiExecutionScheduleList = {
  /**
   * Number of the resource instances in the list
   */
  count: number;
  resources: AiExecutionSchedule[];
} & Record<string, any>;
