import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { DeploymentApi } from '@sap-ai-sdk/ai-api';
import 'dotenv/config';

// Pick .env file from root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

describe('ai-api', () => {
  it('should get deployments', async () => {
    const deployments = await DeploymentApi.deploymentQuery(
      {},
      { 'AI-Resource-Group': 'default' }
    ).execute();
    expect(deployments).toBeDefined();
  });

  it('should create a deployment', async () => {
    const responseData = await DeploymentApi.deploymentCreate(
      {configurationId: '8e2ff27f-d65e-48c4-9b21-1bb2709abfd1'}, 
      {'AI-Resource-Group': 'i745181'}
    ).execute();
    expect(responseData).toBeDefined();
  });
});
