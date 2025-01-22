/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiDeploymentId } from './ai-deployment-id.js';
import type { AiDeploymentUrl } from './ai-deployment-url.js';
import type { AiConfigurationId } from './ai-configuration-id.js';
import type { AiConfigurationName } from './ai-configuration-name.js';
import type { AiExecutableId } from './ai-executable-id.js';
import type { AiScenarioId } from './ai-scenario-id.js';
import type { AiDeploymentStatus } from './ai-deployment-status.js';
import type { AiDeploymentStatusMessage } from './ai-deployment-status-message.js';
import type { AiDeploymentTimeToLive } from './ai-deployment-time-to-live.js';
import type { AiDeploymentDetails } from './ai-deployment-details.js';
/**
 * Detailed data about a deployment
 */
export type AiDeployment = {
  id: AiDeploymentId;
  deploymentUrl?: AiDeploymentUrl;
  configurationId: AiConfigurationId;
  configurationName?: AiConfigurationName;
  executableId?: AiExecutableId;
  scenarioId?: AiScenarioId;
  status: AiDeploymentStatus;
  statusMessage?: AiDeploymentStatusMessage;
  /**
   * Deployment target status
   */
  targetStatus?: 'RUNNING' | 'STOPPED' | 'DELETED';
  /**
   * Last operation applied to this deployment.
   */
  lastOperation?: 'CREATE' | 'UPDATE' | 'DELETE' | 'CASCADE-UPDATE' | any;
  /**
   * configurationId that was running before a PATCH operation has modified the configurationId of the deployment. This can be used for a manual rollback in case the new configurationId results in a DEAD deployment
   * @example "aa97b177-9383-4934-8543-0f91a7a0283a"
   * Pattern: "^[\\w.-]{4,64}$".
   */
  latestRunningConfigurationId?: string;
  ttl?: AiDeploymentTimeToLive;
  details?: AiDeploymentDetails;
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
  /**
   * Timestamp of job submitted
   * Format: "date-time".
   */
  submissionTime?: string;
  /**
   * Timestamp of job status changed to RUNNING
   * Format: "date-time".
   */
  startTime?: string;
  /**
   * Timestamp of job status changed to COMPLETED/DEAD/STOPPED
   * Format: "date-time".
   */
  completionTime?: string;
} & Record<string, any>;
