import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { DeploymentApi } from '@sap-ai-sdk/ai-core';
import 'dotenv/config';

// Pick .env file from root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

describe('ai-core', () => {
  test.skip('should get deployments, but is currently broken', async () => {
    const deployments = await DeploymentApi.deploymentQuery(
      {},
      { 'AI-Resource-Group': 'default' }
    ).execute();
    expect(deployments).toBeDefined();
  });
});
