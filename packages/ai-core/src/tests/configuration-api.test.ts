import nock from 'nock';
import {
  AiConfigurationBaseData,
  AiConfigurationCreationResponse,
  AiConfigurationList,
  ConfigurationApi
} from '../client/AI_CORE_API/index.js';
import { aiCoreDestination, mockClientCredentialsGrantCall } from '../../../../test-util/mock-http.js';

describe('configuration', () => {
   beforeAll(() => {
    mockClientCredentialsGrantCall();
  })
  afterAll(() => {
    nock.cleanAll();
  });

  it('parses a successful response for get request', async () => {
    const expectedResponse: AiConfigurationList = {
      count: 1,
      resources: [
        {
          createdAt: '2024-04-17T15:19:45Z',
          executableId: 'azure-openai',
          id: '0a1b2c3d',
          inputArtifactBindings: [],
          name: 'gpt-4-32k',
          parameterBindings: [
            {
              key: 'modelName',
              value: 'gpt-4-32k'
            },
            {
              key: 'modelVersion',
              value: 'latest'
            }
          ],
          scenarioId: 'foundation-models'
        }
      ]
    };

    nock(aiCoreDestination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .get('/lm/configurations')
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const result: AiConfigurationList =
      await ConfigurationApi.configurationQuery(
        {},
        { 'AI-Resource-Group': 'default' }
      ).execute();

    expect(result).toEqual(expectedResponse);
  });

  it('parses a successful response for post request', async () => {
    const expectedResponse: AiConfigurationCreationResponse = {
      id: '3d2c1b0a',
      message: 'Configuration created'
    };

    nock(aiCoreDestination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .post('/lm/configurations')
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const configurationPostData: AiConfigurationBaseData = {
      name: 'training-test-config',
      executableId: 'azure-openai',
      scenarioId: 'foundation-models',
      inputArtifactBindings: [
        {
          artifactId: '0a1b2c3d',
          key: 'spam-data'
        }
      ]
    };

    const result: AiConfigurationCreationResponse =
      await ConfigurationApi.configurationCreate(configurationPostData, {
        'AI-Resource-Group': 'default'
      }).execute();

    expect(result).toEqual(expectedResponse);
  });
});
