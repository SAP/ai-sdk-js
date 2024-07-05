/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { CreationResponse } from './creation-response.js';
import type { DeploymentUrl } from './deployment-url.js';
import type { ExecutionStatus } from './execution-status.js';
import type { DeploymentCreationResponseMessage } from './deployment-creation-response-message.js';
import type { DeploymentTimeToLive } from './deployment-time-to-live.js';
/**
 * Representation of the 'DeploymentCreationResponse' schema.
 */
export type DeploymentCreationResponse = CreationResponse & {
  deploymentUrl?: DeploymentUrl;
  status?: ExecutionStatus;
  message?: DeploymentCreationResponseMessage;
  ttl?: DeploymentTimeToLive;
} & Record<string, any>;
