/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { Execution } from './execution.js';
import type { ExecutionStatusDetails } from './execution-status-details.js';
/**
 * Representation of the 'ExecutionResponseWithDetails' schema.
 */
export type ExecutionResponseWithDetails = Execution & {
  statusDetails?: ExecutionStatusDetails;
} & Record<string, any>;
