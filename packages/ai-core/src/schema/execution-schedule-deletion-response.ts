/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { CreationResponse } from './creation-response.js';
import type { ExecutionScheduleDeletionResponseMessage } from './execution-schedule-deletion-response-message.js';
/**
 * Representation of the 'ExecutionScheduleDeletionResponse' schema.
 */
export type ExecutionScheduleDeletionResponse = CreationResponse & {
  message?: ExecutionScheduleDeletionResponseMessage;
} & Record<string, any>;