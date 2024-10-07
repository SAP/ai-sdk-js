import { DeploymentApi } from '@sap-ai-sdk/ai-api';

export default class AiApiService {
  async getDeployments() {
    const response = await DeploymentApi.deploymentQuery(
      {},
      { 'AI-Resource-Group': 'default' }
    ).execute();
    return JSON.stringify(response.resources);
  }
}
