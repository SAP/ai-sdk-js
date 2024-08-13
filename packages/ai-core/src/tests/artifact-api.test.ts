import nock from 'nock';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import {
  AiArtifactCreationResponse,
  AiArtifactList,
  AiArtifactPostData
} from '../client/AI_CORE_API/schema/index.js';
import { ArtifactApi } from '../client/AI_CORE_API/artifact-api.js';

describe('artifact', () => {
  const destination: HttpDestination = {
    url: 'https://ai.example.com'
  };

  afterEach(() => {
    nock.cleanAll();
  });

  it('parses a successful response for get request', async () => {
    const expectedResponse: AiArtifactList = {
      count: 1,
      resources: [
        {
          createdAt: '2024-07-08T13:36:41Z',
          description: 'dataset for training test',
          id: '0a1b2c3d',
          kind: 'dataset',
          modifiedAt: '2024-07-08T13:36:41Z',
          name: 'training-test-data',
          scenarioId: 'foundation-models',
          url: 'ai://default/spam/data'
        }
      ]
    };

    nock(destination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .get('/lm/artifacts')
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const result: AiArtifactList = await ArtifactApi.artifactQuery(
      {},
      { 'AI-Resource-Group': 'default' }
    ).execute(destination);

    expect(result).toEqual(expectedResponse);
  });

  it('parses a successful response for post request', async () => {
    const expectedResponse: AiArtifactCreationResponse = {
      id: '3d2c1b0a',
      message: 'Artifact acknowledged',
      url: 'ai://default/spam/data'
    };

    nock(destination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .post('/lm/artifacts')
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const aiArtifactPostData: AiArtifactPostData = {
      description: 'dataset for training test',
      kind: 'dataset',
      name: 'training-test-data',
      scenarioId: 'foundation-models',
      url: 'ai://default/spam/data'
    };

    const result: AiArtifactCreationResponse = await ArtifactApi.artifactCreate(
      aiArtifactPostData,
      { 'AI-Resource-Group': 'default' }
    ).execute(destination);

    expect(result).toEqual(expectedResponse);
  });
});
