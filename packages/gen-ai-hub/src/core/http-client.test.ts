import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { mockGetAiCoreDestination } from '../../test-util/mock-context.js';
import { mockInference } from '../../test-util/mock-http.js';
import { executeRequest } from './http-client.js';
import { debug } from 'debug';

describe('http-client', () => {
  let destination: HttpDestination;
  debug.enable('nock.*');

  beforeAll(() => {
    destination = mockGetAiCoreDestination();
  });

  it('should execute a request to the AI Core service', async () => {
    const mockPrompt = { prompt: 'some test prompt' };
    const mockPromptResponse = { completion: 'some test completion' };
    const mockEndpoint = { deploymentId: 'id', path: '/mock-endpoint'  };
    const scope = mockInference(
      {
        request: {
          data: mockPrompt,
          destination: destination,
          endpoint: mockEndpoint
        },
        response: {
          status: 200,
          data: mockPromptResponse
        }
      }
    );
    const res = await executeRequest(
      mockEndpoint,
      mockPrompt
    );

    expect(scope.isDone()).toBe(true);
    expect(res.status).toBe(200);
    expect(res.data).toEqual(mockPromptResponse);
  }, 10000);
});
