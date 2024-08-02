/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiId } from './ai-id';
import type { AiDeploymentCreationResponseMessage } from './ai-deployment-creation-response-message';
import type { AiDeploymentUrl } from './ai-deployment-url';
import type { AiExecutionStatus } from './ai-execution-status';
import type { AiDeploymentTimeToLive } from './ai-deployment-time-to-live';
/**
 * Representation of the 'AiDeploymentCreationResponse' schema.
 */
export type AiDeploymentCreationResponse = {
  id: AiId;
  message: AiDeploymentCreationResponseMessage;
  deploymentUrl?: AiDeploymentUrl;
  status?: AiExecutionStatus;
  ttl?: AiDeploymentTimeToLive;
} & Record<string, any>;
