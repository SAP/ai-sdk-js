import { DeploymentApi } from '@sap-ai-sdk/ai-api';
import type {
  AiDeploymentBulkModificationResponse,
  AiDeploymentCreationResponse,
  AiDeploymentDeletionResponse,
  AiDeploymentList,
  AiDeploymentModificationRequestList,
  AiDeploymentStatus
} from '@sap-ai-sdk/ai-api';

/**
 * Get all deployments filtered by status.
 * @param resourceGroup - AI-Resource-Group where the resources are available.
 * @param status - Optional query parameter to filter deployments by status.
 * @returns List of deployments.
 */
export async function getDeployments(
  resourceGroup: string,
  status?: AiDeploymentStatus
): Promise<AiDeploymentList> {
  // check for optional query parameters.
  const queryParams = status ? { status } : {};
  return DeploymentApi.deploymentQuery(queryParams, {
    'AI-Resource-Group': resourceGroup
  }).execute();
}

/**
 * Get all deployments filtered by status with destination.
 * @param resourceGroup - AI-Resource-Group where the resources are available.
 * @param status - Optional query parameter to filter deployments by status.
 * @returns List of deployments.
 */
export async function getDeploymentsWithDestination(
  resourceGroup: string,
  status?: AiDeploymentStatus
): Promise<AiDeploymentList> {
  // check for optional query parameters.
  const queryParams = status ? { status } : {};
  return DeploymentApi.deploymentQuery(queryParams, {
    'AI-Resource-Group': resourceGroup
  }).execute({
    destinationName: 'e2e-aicore'
  });
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
 * Stop all deployments with the specific configuration ID.
 * Only deployments with 'status': 'RUNNING' can be stopped.
 * @param configurationId - ID of the configuration to be used.
 * @param resourceGroup - AI-Resource-Group where the resources are available.
 * @returns Deployment modification response list with 'targetStatus': 'STOPPED'.
 */
export async function stopDeployments(
  configurationId: string,
  resourceGroup: string
): Promise<AiDeploymentBulkModificationResponse> {
  // Get all RUNNING deployments with configurationId
  const deployments: AiDeploymentList = await DeploymentApi.deploymentQuery(
    { status: 'RUNNING', configurationId },
    { 'AI-Resource-Group': resourceGroup }
  ).execute();

  // Map the deployment Ids and add property targetStatus: 'STOPPED'
  const deploymentsToStop: any = deployments.resources.map(deployment => ({
    id: deployment.id,
    targetStatus: 'STOPPED'
  }));

  // Send batch modify request to stop deployments
  return DeploymentApi.deploymentBatchModify(
    { deployments: deploymentsToStop as AiDeploymentModificationRequestList },
    { 'AI-Resource-Group': resourceGroup }
  ).execute();
}

/**
 * Delete all deployments.
 * Only deployments with 'status': 'STOPPED' and 'status': 'UNKNOWN' can be deleted.
 * @param resourceGroup - AI-Resource-Group where the resources are available.
 * @returns Deployment deletion response list with 'targetStatus': 'DELETED'.
 */
export async function deleteDeployments(
  resourceGroup: string
): Promise<AiDeploymentDeletionResponse[]> {
  // Get all STOPPED and UNKNOWN deployments
  const [runningDeployments, unknownDeployments] = await Promise.all([
    DeploymentApi.deploymentQuery(
      { status: 'STOPPED' },
      { 'AI-Resource-Group': resourceGroup }
    ).execute(),
    DeploymentApi.deploymentQuery(
      { status: 'UNKNOWN' },
      { 'AI-Resource-Group': resourceGroup }
    ).execute()
  ]);

  const deploymentsToDelete = [
    ...runningDeployments.resources,
    ...unknownDeployments.resources
  ];

  // Delete all deployments
  return Promise.all(
    deploymentsToDelete.map(deployment =>
      DeploymentApi.deploymentDelete(deployment.id, {
        'AI-Resource-Group': resourceGroup
      }).execute()
    )
  );
}
