import { AiApiService, Deployments } from '#cds-models/AiApiService';
import { DeploymentApi } from '@sap-ai-sdk/ai-api';

export = (srv: AiApiService) => {
  srv.on('READ', Deployments.name, async _ => {
    const response = await DeploymentApi.deploymentQuery(
      {},
      { 'AI-Resource-Group': 'default' }
    ).execute();
    return response.resources.map(({ id, deploymentUrl, status }) => ({ id, deploymentUrl, status }));
  });
};
