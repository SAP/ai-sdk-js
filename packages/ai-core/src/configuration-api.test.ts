import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import {
  ConfigurationApi,
  ConfigurationBaseData,
  ConfigurationCreationResponse,
  ConfigurationList
} from './index.js';

describe('configuration', () => {
  const destination: HttpDestination = {
    url: 'https://ai.example.com'
  };

  afterEach(() => {
    nock.cleanAll();
  });

  it('get configuration parses a successful response', async () => {
    const expectedResponse: ConfigurationList = {
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

    nock(destination.url)
      .get('/lm/configurations')
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json',
        'AI-Resource-Group': 'default'
      });

    const result: ConfigurationList = await ConfigurationApi.configurationQuery(
      {},
      { 'AI-Resource-Group': 'default' }
    ).execute(destination);

    expect(result).toEqual(expectedResponse);
  });

  it('post configuration parses a successful response', async () => {
    const expectedResponse: ConfigurationCreationResponse = {
      id: '3d2c1b0a',
      message: 'Configuration created'
    };

    nock(destination.url)
      .post('/lm/configurations')
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json',
        'AI-Resource-Group': 'default'
      });

    const configurationPostData: ConfigurationBaseData = {
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

    const result: ConfigurationCreationResponse =
      await ConfigurationApi.configurationCreate(configurationPostData, {
        'AI-Resource-Group': 'default'
      }).execute(destination);

    expect(result).toEqual(expectedResponse);
  });
});
