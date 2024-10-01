import {
  AiDeploymentCreationResponse,
  AiDeploymentDeletionResponse,
  AiDeploymentList,
  AiDeploymentModificationResponse,
  AiDeploymentResponseWithDetails,
  DeploymentApi
} from '@sap-ai-sdk/ai-api';

/**
 * Get all deployments.
 * @param resourceGroup - AI-Resource-Group where the resources are available.
 * @param status - Optional parameter to filter deployments by status
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
  const response = await DeploymentApi.deploymentQuery(
    queryParams,
    { 'AI-Resource-Group': resourceGroup }
  ).execute();

  return response;
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
  const response = await DeploymentApi.deploymentGet(
    deploymentId,
    {},
    { 'AI-Resource-Group': resourceGroup }
  ).execute();

  return response;
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
  const response = await DeploymentApi.deploymentCreate(
    { configurationId },
    { 'AI-Resource-Group': resourceGroup }
  ).execute();

  return response;
}

/**
 * Update target status of a specific deployment to stop it. 
 * Only deployments with 'status': 'RUNNING' can be stopped.
 * @param deploymentId - ID of the specific deployment.
 * @param resourceGroup - AI-Resource-Group where the resources are available.
 * @returns Deployment modification response with 'targetStatus': 'STOPPED'.
 */
export async function modifyDeployment(
  deploymentId: string,
  resourceGroup: string
): Promise<AiDeploymentModificationResponse> {
  const response = await DeploymentApi.deploymentModify(
    deploymentId,
    { targetStatus: 'STOPPED' },
    { 'AI-Resource-Group': resourceGroup }
  ).execute();

  return response;
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
  const response = await DeploymentApi.deploymentDelete(deploymentId, {
    'AI-Resource-Group': resourceGroup
  }).execute();

  return response;
}
