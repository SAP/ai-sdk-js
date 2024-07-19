import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import {
  EnactmentCreationRequest,
  ExecutionApi,
  ExecutionCreationResponse,
  ExecutionList
} from './index.js';

describe('execution', () => {
  const destination: HttpDestination = {
    url: 'https://ai.example.com'
  };

  afterEach(() => {
    nock.cleanAll();
  });

  it('parses a successful response for get request', async () => {
    const expectedResponse: ExecutionList = {
      count: 1,
      resources: [
        {
          completionTime: '2023-08-05T14:10:16Z',
          configurationId: '3d2c1b0a',
          configurationName: 'spam-detection-execution-config-0',
          createdAt: '2023-08-05T14:07:52Z',
          executableId: 'wt-spam-detection',
          id: '0a1b2c3d',
          modifiedAt: '2023-08-05T14:10:54Z',
          outputArtifacts: [
            {
              createdAt: '2023-08-05T14:10:05Z',
              description: '',
              executionId: '0a1b2c3d',
              id: '4e5f6g7h',
              kind: 'model',
              modifiedAt: '2023-08-05T14:10:05Z',
              name: 'classifier-model-output',
              scenarioId: 'scenario-spam-detection',
              url: 'ai://default/0a1b2c3d/classifier-model-output'
            }
          ],
          scenarioId: 'scenario-spam-detection',
          startTime: '2023-08-05T14:09:21Z',
          status: 'COMPLETED',
          submissionTime: '2023-08-05T14:09:21Z',
          targetStatus: 'COMPLETED'
        }
      ]
    };
    nock(destination.url).get('/lm/executions').reply(200, expectedResponse, {
      'Content-Type': 'application/json'
    });

    const result: ExecutionList = await ExecutionApi.executionQuery(
      {},
      { 'AI-Resource-Group': 'default' }
    ).execute(destination);

    expect(result).toEqual(expectedResponse);
  });

  it('parses a successful response for post request', async () => {
    const expectedResponse: ExecutionCreationResponse = {
      id: '8i9j0k1l',
      message: 'Execution acknowledged',
      url: 'ai://default/8i9j0k1l'
    };
    nock(destination.url).post('/lm/executions').reply(200, expectedResponse, {
      'Content-Type': 'application/json'
    });

    const executionPostData: EnactmentCreationRequest = {
      configurationId: '8i9j0k1l'
    };

    const result: ExecutionCreationResponse =
      await ExecutionApi.executionCreate(executionPostData, {
        'AI-Resource-Group': 'default'
      }).execute(destination);

    expect(result).toEqual(expectedResponse);
  });
});
