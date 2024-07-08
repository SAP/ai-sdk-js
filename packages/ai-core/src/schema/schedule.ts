/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { Cron } from './cron.js';
import type { ScheduleStartEnd } from './schedule-start-end.js';
/**
 * Representation of the 'Schedule' schema.
 */
export type Schedule = {
  cron?: Cron;
} & Record<string, any> &
  ScheduleStartEnd;
