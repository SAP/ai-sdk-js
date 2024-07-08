/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { CreationResponse } from './creation-response.js';
import type { ExecutionDeletionResponseMessage } from './execution-deletion-response-message.js';
/**
 * Representation of the 'ExecutionDeletionResponse' schema.
 */
export type ExecutionDeletionResponse = CreationResponse & {
  message?: ExecutionDeletionResponseMessage;
} & Record<string, any>;
