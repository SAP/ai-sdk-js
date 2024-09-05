/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ExecutionScheduleCreationData } from './execution-schedule-creation-data.js';
import type { ExecutionScheduleId } from './execution-schedule-id.js';
import type { ExecutionScheduleStatus } from './execution-schedule-status.js';
/**
 * Representation of the 'ExecutionScheduleData' schema.
 */
export type ExecutionScheduleData = ExecutionScheduleCreationData & {
  id?: ExecutionScheduleId;
  status?: ExecutionScheduleStatus;
} & Record<string, any>;