/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiDeploymentTargetStatus } from './ai-deployment-target-status';
import type { AiConfigurationId } from './ai-configuration-id';
/**
 * Request object for changing the target status of a deployment (currently only STOPPED is supported)
 */
export type AiDeploymentModificationRequest = {
  targetStatus?: AiDeploymentTargetStatus;
  configurationId?: AiConfigurationId;
} & Record<string, any>;
