/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RTAScenarioId } from './rta-scenario-id.js';
import type { RTAExecutableId } from './rta-executable-id.js';
import type { RTADeploymentId } from './rta-deployment-id.js';
import type { RTADeploymentUrl } from './rta-deployment-url.js';
import type { RTALatestRunningTargetId } from './rta-latest-running-target-id.js';
import type { RTATargetId } from './rta-target-id.js';
import type { RTATtl } from './rta-ttl.js';
/**
 * Detailed data about an inference-pipeline deployment
 */
export type RTADeployment = {
  scenarioId: RTAScenarioId;
  executableId: RTAExecutableId;
  id?: RTADeploymentId;
  deploymentUrl?: RTADeploymentUrl;
  latestRunningTargetId?: RTALatestRunningTargetId;
  targetId?: RTATargetId;
  ttl?: RTATtl;
  /**
   * Deployment status
   */
  status?:
    | 'PENDING'
    | 'RUNNING'
    | 'COMPLETED'
    | 'DEAD'
    | 'UNKNOWN'
    | 'DELETING';
  /**
   * Deployment status message
   * Max Length: 256.
   */
  statusMessage?: string;
  /**
   * Reflection of user's action on deployment. The value will be CREATE after user sends POST - create deployment, UPDATE after user sends PATCH - update deployment, and DELETE after user sends DELETE - delete deployment
   */
  lastOperation?: 'CREATE' | 'UPDATE' | 'CASCADE-UPDATE' | 'DELETE';
  /**
   * Timestamp of resource creation
   * Format: "date-time".
   */
  createdAt: string;
  /**
   * Timestamp of latest resource modification
   * Format: "date-time".
   */
  modifiedAt: string;
} & Record<string, any>;
