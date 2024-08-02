/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiDeploymentTimeToLive } from './ai-deployment-time-to-live';
import type { AiConfigurationId } from './ai-configuration-id';
/**
 * Request object for creating an execution or an deployment
 */
export type AiDeploymentCreationRequest = {
  ttl?: AiDeploymentTimeToLive;
  configurationId: AiConfigurationId;
} & Record<string, any>;
