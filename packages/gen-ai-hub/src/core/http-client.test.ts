import { jest } from '@jest/globals';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import { mockGetAiCoreDestination } from '../test-util/mock-context.js';
import { mockInference } from '../test-util/mock-http.js';

jest.unstable_mockModule('./context.js', () => ({
  getAiCoreDestination: jest.fn(() =>
    Promise.resolve(mockGetAiCoreDestination())
  )
}));
const { executeRequest } = await import('./http-client.js');

describe('http-client', () => {
  let destination: HttpDestination;

  beforeAll(() => {
    destination = mockGetAiCoreDestination();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should execute a request to the AI Core service', async () => {
    const mockPrompt = { prompt: 'some test prompt' };
    const mockPromptResponse = { completion: 'some test completion' };

    const scope = mockInference(
      {
        data: {
          deploymentConfiguration: { deploymentId: 'deployment_id' },
          prompt: 'some test prompt'
        }
      },
      {
        data: mockPromptResponse,
        status: 200
      },
      destination
    );
    const res = await executeRequest(
      { url: '/mock-endpoint', apiVersion: 'mock-api-version' },
      {
        deploymentConfiguration: { deploymentId: 'deployment_id' },
        ...mockPrompt
      }
    );

    expect(scope.isDone()).toBe(true);
    expect(res.status).toBe(200);
    expect(res.data).toEqual(mockPromptResponse);
  }, 10000);
});
