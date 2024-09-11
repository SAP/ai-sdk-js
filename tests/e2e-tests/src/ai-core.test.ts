import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  AiDeployment,
  AiDeploymentList,
  DeploymentApi,
  ScenarioApi
} from '@sap-ai-sdk/ai-api';
import 'dotenv/config';
import _ from 'lodash';

// Pick .env file from root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

describe('AI Core APIs', () => {
  describe('DeploymentAPI', () => {
    const MAX_RETRIES = 25;
    const RETRY_INTERVAL = 5000;
    let createdDeploymentId: string | undefined;
    let initialState: AiDeploymentList | undefined;

    async function waitForDeploymentToReachStatus(
      deploymentId: string,
      targetStatus: 'RUNNING' | 'STOPPED'
    ): Promise<AiDeployment> {
      for (let i = 0; i < MAX_RETRIES; i++) {
        const deploymentDetail = await DeploymentApi.deploymentGet(
          deploymentId,
          {},
          { 'AI-Resource-Group': 'i745181' }
        ).execute();

        if (deploymentDetail.status === targetStatus) {
          return deploymentDetail;
        }

        await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
      }
      throw new Error(
        `Deployment did not reach ${targetStatus} status within the expected time.`
      );
    }

    const sanitizedState = (state: AiDeploymentList | undefined) => ({
      ...state,
      resources: state?.resources.map(resource =>
        _.omit(resource, ['modifiedAt'])
      )
    });

    beforeAll(async () => {
      const queryResponse = await DeploymentApi.deploymentQuery(
        {},
        { 'AI-Resource-Group': 'i745181' }
      ).execute();
      expect(queryResponse).toBeDefined();
      initialState = queryResponse;
    });

    it('should create a deployment and wait for it to run', async () => {
      const createResponse = await DeploymentApi.deploymentCreate(
        { configurationId: '8e2ff27f-d65e-48c4-9b21-1bb2709abfd1' },
        { 'AI-Resource-Group': 'i745181' }
      ).execute();

      expect(createResponse).toBeDefined();
      expect(createResponse.message).toBe('Deployment scheduled.');
      expect(createResponse.id).toBeDefined();

      const runningDeployment = await waitForDeploymentToReachStatus(
        createResponse.id,
        'RUNNING'
      );

      expect(runningDeployment.status).toBe('RUNNING');
      expect(runningDeployment.deploymentUrl).toBeTruthy();
      createdDeploymentId = runningDeployment.id;
    }, 120000);

    it('should modify the deployment to stop it', async () => {
      expect(createdDeploymentId).toBeDefined();

      const modifyResponse = await DeploymentApi.deploymentModify(
        createdDeploymentId!,
        { targetStatus: 'STOPPED' },
        { 'AI-Resource-Group': 'i745181' }
      ).execute();

      expect(modifyResponse).toBeDefined();
      expect(modifyResponse.message).toBe('Deployment modification scheduled');

      const stoppedDeployment = await waitForDeploymentToReachStatus(
        createdDeploymentId!,
        'STOPPED'
      );
      expect(stoppedDeployment.status).toBe('STOPPED');
    }, 90000);

    it('should delete the deployment', async () => {
      const deleteResponse = await DeploymentApi.deploymentDelete(
        createdDeploymentId!,
        { 'AI-Resource-Group': 'i745181' }
      ).execute();

      expect(deleteResponse).toBeDefined();
      expect(deleteResponse.message).toBe('Deletion scheduled');
    });

    afterAll(async () => {
      await new Promise(r => setTimeout(r, 20000));
      const queryResponse = await DeploymentApi.deploymentQuery(
        {},
        { 'AI-Resource-Group': 'i745181' }
      ).execute();
      expect(queryResponse).toBeDefined();

      const sanitizedInitialState = sanitizedState(initialState);
      const sanitizedEndState = sanitizedState(queryResponse);
      expect(sanitizedEndState).toStrictEqual(sanitizedInitialState);
    }, 30000);
  });

  describe('ScenarioAPI', () => {
    it('should get list of available scenarios', async () => {
      const scenarios = await ScenarioApi.scenarioQuery({
        'AI-Resource-Group': 'default'
      }).execute();

      expect(scenarios).toBeDefined();
      const foundationModel = scenarios.resources.find(
        scenario => scenario.id === 'foundation-models'
      );
      expect(foundationModel).toBeDefined();
    });
  });
});
