import { DeploymentApi } from '@sap-ai-sdk/ai-api';
import type {
  AiDeploymentCreationResponse,
  AiDeploymentDeletionResponse,
  AiDeploymentList,
  AiDeploymentModificationResponse,
  AiDeploymentResponseWithDetails
} from '@sap-ai-sdk/ai-api';

/**
 * Get all deployments.
 * @param resourceGroup - AI-Resource-Group where the resources are available.
 * @param status - Optional parameter to filter deployments by status.
 * @returns All deployments.
 */
export async function getDeployments(
  resourceGroup: string,
  status?:
    | 'PENDING'
    | 'RUNNING'
    | 'COMPLETED'
    | 'DEAD'
    | 'STOPPING'
    | 'STOPPED'
    | 'UNKNOWN'
): Promise<AiDeploymentList> {
  // check for optional query parameters.
  const queryParams = status ? { status } : {};
  return DeploymentApi.deploymentQuery(queryParams, {
    'AI-Resource-Group': resourceGroup
  }).execute();
}

/**
 * Get information about specific deployment.
 * @param deploymentId - ID of the specific deployment.
 * @param resourceGroup - AI-Resource-Group where the resources are available.
 * @returns Details for deplyoment with deploymentId.
 */
export async function getDeployment(
  deploymentId: string,
  resourceGroup: string
): Promise<AiDeploymentResponseWithDetails> {
  return DeploymentApi.deploymentGet(
    deploymentId,
    {},
    { 'AI-Resource-Group': resourceGroup }
  ).execute();
}

/**
 * Create a deployment using the configuration specified by configurationId.
 * @param configurationId - ID of the configuration to be used.
 * @param resourceGroup - AI-Resource-Group where the resources are available.
 * @returns Deployment creation response with 'targetStatus': 'RUNNING'.
 */
export async function createDeployment(
  configurationId: string,
  resourceGroup: string
): Promise<AiDeploymentCreationResponse> {
  return DeploymentApi.deploymentCreate(
    { configurationId },
    { 'AI-Resource-Group': resourceGroup }
  ).execute();
}

/**
 * Update target status of a specific deployment to stop it.
 * Only deployments with 'status': 'RUNNING' can be stopped.
 * @param deploymentId - ID of the specific deployment.
 * @param resourceGroup - AI-Resource-Group where the resources are available.
 * @returns Deployment modification response with 'targetStatus': 'STOPPED'.
 */
export async function stopDeployment(
  deploymentId: string,
  resourceGroup: string
): Promise<AiDeploymentModificationResponse> {
  return DeploymentApi.deploymentModify(
    deploymentId,
    { targetStatus: 'STOPPED' },
    { 'AI-Resource-Group': resourceGroup }
  ).execute();
}

/**
 * Mark deployment with deploymentId as deleted.
 * Only deployments with 'status': 'STOPPED' can be deleted.
 * @param deploymentId - ID of the specific deployment.
 * @param resourceGroup - AI-Resource-Group where the resources are available.
 * @returns Deployment deletion response with 'targetStatus': 'DELETED'.
 */
export async function deleteDeployment(
  deploymentId: string,
  resourceGroup: string
): Promise<AiDeploymentDeletionResponse> {
  return DeploymentApi.deploymentDelete(deploymentId, {
    'AI-Resource-Group': resourceGroup
  }).execute();
}
