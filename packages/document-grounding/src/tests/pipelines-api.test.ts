import nock from 'nock';
import {
  aiCoreDestination,
  mockClientCredentialsGrantCall
} from '../../../../test-util/mock-http.js';
import { PipelinesApi } from '../client/api/index.js';
import type { GetPipelines } from '../client/api/index.js';

describe('pipelines', () => {
  beforeEach(() => {
    mockClientCredentialsGrantCall();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it('should get all pipelines', async () => {
    const expectedResponse: GetPipelines = {
      resources: [
        {
          id: 'pipeline-id',
          type: 'MSSharePoint',
          configuration: {
            destination: 'https://example.com',
            sharePoint: {
              site: {
                id: 'site-id',
                name: 'site-name',
                includePaths: ['/path1', '/path2']
              }
            }
          }
        }
      ],
      count: 0
    };

    nock(aiCoreDestination.url, {
      reqheaders: {
        'AI-Resource-Group': 'default'
      }
    })
      .get('/v2/lm/document-grounding/pipelines')
      .reply(200, expectedResponse, {
        'Content-Type': 'application/json'
      });

    const result: GetPipelines =
      await PipelinesApi.pipelineV1PipelineEndpointsGetAllPipeline(
        {},
        { 'AI-Resource-Group': 'default' }
      ).execute();

    expect(result).toEqual(expectedResponse);
  });
});
