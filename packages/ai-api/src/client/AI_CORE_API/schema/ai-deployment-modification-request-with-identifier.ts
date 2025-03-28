/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiDeploymentId } from './ai-deployment-id.js';
/**
 * Request object for changing the target status of a deployment ( STOPPED and DELETED are supported)
 */
export type AiDeploymentModificationRequestWithIdentifier = {
  id: AiDeploymentId;
  /**
   * Deployment target status
   */
  targetStatus: 'STOPPED' | 'DELETED';
} & Record<string, any>;
