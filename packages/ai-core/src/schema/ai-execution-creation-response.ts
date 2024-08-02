/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiId } from './ai-id';
import type { AiExecutionCreationResponseMessage } from './ai-execution-creation-response-message';
import type { AiExecutionStatus } from './ai-execution-status';
/**
 * Representation of the 'AiExecutionCreationResponse' schema.
 */
export type AiExecutionCreationResponse = {
  id: AiId;
  message: AiExecutionCreationResponseMessage;
  status?: AiExecutionStatus;
} & Record<string, any>;
