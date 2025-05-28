import nock from 'nock';
import { ArtifactApi } from '../client/AI_CORE_API';
import {
  aiCoreDestination,
  mockClientCredentialsGrantCall
} from '../../../../test-util/mock-http.js';
import type {
  AiArtifactCreationResponse,
  AiArtifactList,
  AiArtifactPostData
} from '../client/AI_CORE_API/index.js';

describe('artifact', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });
  afterEach(() => {
    nock.cleanAll();
    nock.restore();
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

    nock(aiCoreDestination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .get('/v2/lm/artifacts')
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const result: AiArtifactList = await ArtifactApi.artifactQuery(
      {},
      { 'AI-Resource-Group': 'default' }
    ).execute();

    expect(result).toEqual(expectedResponse);
  });

  it('parses a successful response for post request', async () => {
    const expectedResponse: AiArtifactCreationResponse = {
      id: '3d2c1b0a',
      message: 'Artifact acknowledged',
      url: 'ai://default/spam/data'
    };

    nock(aiCoreDestination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .post('/v2/lm/artifacts')
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
    ).execute();

    expect(result).toEqual(expectedResponse);
  });
});
