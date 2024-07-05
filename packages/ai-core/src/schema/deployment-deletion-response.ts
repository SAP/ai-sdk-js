/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { CreationResponse } from './creation-response.js';
import type { DeploymentDeletionResponseMessage } from './deployment-deletion-response-message.js';
/**
 * Representation of the 'DeploymentDeletionResponse' schema.
 */
export type DeploymentDeletionResponse = CreationResponse & {
  message?: DeploymentDeletionResponseMessage;
} & Record<string, any>;
