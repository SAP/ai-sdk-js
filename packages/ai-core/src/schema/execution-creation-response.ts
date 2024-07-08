/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { CreationResponse } from './creation-response.js';
import type { ExecutionStatus } from './execution-status.js';
import type { ExecutionCreationResponseMessage } from './execution-creation-response-message.js';
/**
 * Representation of the 'ExecutionCreationResponse' schema.
 */
export type ExecutionCreationResponse = CreationResponse & {
  status?: ExecutionStatus;
  message?: ExecutionCreationResponseMessage;
} & Record<string, any>;
