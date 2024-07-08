/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DeploymentId } from './deployment-id.js';
import type { DeploymentUrl } from './deployment-url.js';
import type { ConfigurationId } from './configuration-id.js';
import type { ConfigurationName } from './configuration-name.js';
import type { ScenarioId } from './scenario-id.js';
import type { DeploymentStatus } from './deployment-status.js';
import type { DeploymentStatusMessage } from './deployment-status-message.js';
import type { DeploymentTimeToLive } from './deployment-time-to-live.js';
import type { DeploymentDetails } from './deployment-details.js';
/**
 * Detailed data about a deployment
 */
export type DeploymentDetailData = {
  id: DeploymentId;
  deploymentUrl?: DeploymentUrl;
  configurationId: ConfigurationId;
  configurationName?: ConfigurationName;
  scenarioId?: ScenarioId;
  status: DeploymentStatus;
  statusMessage?: DeploymentStatusMessage;
  /**
   * Deployment target status
   */
  targetStatus?: 'RUNNING' | 'STOPPED' | 'DELETED.js';
  /**
   * Last operation applied to this deployment.
   */
  lastOperation?: 'CREATE' | 'UPDATE' | 'DELETE' | 'CASCADE-UPDATE' | any;
  latestRunningConfigurationId?: ConfigurationId & any;
  ttl?: DeploymentTimeToLive;
  details?: DeploymentDetails;
} & Record<string, any>;
