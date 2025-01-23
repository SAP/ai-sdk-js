/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiDeploymentTimeToLive } from './ai-deployment-time-to-live.js';
import type { AiConfigurationId } from './ai-configuration-id.js';
/**
 * Request object for creating an execution or an deployment
 */
export type AiDeploymentCreationRequest = {
  ttl?: AiDeploymentTimeToLive;
  configurationId: AiConfigurationId;
} & Record<string, any>;
