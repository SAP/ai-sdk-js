import nock from 'nock';
import {
  AiEnactmentCreationRequest,
  AiExecutionCreationResponse,
  AiExecutionList
} from './schema/index.js';
import { ExecutionApi } from './execution-api.js';
import { aiCoreDestination, mockClientCredentialsGrantCall } from '../../../../../test-util/mock-http.js';

describe('execution', () => {
  beforeAll(() => {
    mockClientCredentialsGrantCall();
  })
  afterAll(() => {
    nock.cleanAll();
  });

  it('parses a successful response for get request', async () => {
    const expectedResponse: AiExecutionList = {
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
    nock(aiCoreDestination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .get('/lm/executions')
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const result: AiExecutionList = await ExecutionApi.executionQuery(
      {},
      { 'AI-Resource-Group': 'default' }
    ).execute();

    expect(result).toEqual(expectedResponse);
  });

  it('parses a successful response for post request', async () => {
    const expectedResponse: AiExecutionCreationResponse = {
      id: '8i9j0k1l',
      message: 'Execution acknowledged',
      url: 'ai://default/8i9j0k1l'
    };
    nock(aiCoreDestination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .post('/lm/executions')
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const executionPostData: AiEnactmentCreationRequest = {
      configurationId: '8i9j0k1l'
    };

    const result: AiExecutionCreationResponse =
      await ExecutionApi.executionCreate(executionPostData, {
        'AI-Resource-Group': 'default'
      }).execute();

    expect(result).toEqual(expectedResponse);
  });
});
