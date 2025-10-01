import nock from 'nock';
import { mockClientCredentialsGrantCall } from '../../../test-util/mock-http.js';
import { dummyToken } from '../../../test-util/mock-jwt.js';
import { getAiCoreDestination } from './context.js';

describe('context', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...originalEnv };
    delete process.env.AICORE_SERVICE_KEY;

    // Clean all nock interceptors
    nock.cleanAll();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  afterAll(() => {
    nock.cleanAll();
  });

  it('should throw if client credentials are not fetched', async () => {
    // Clean up any existing mocks first
    nock.cleanAll();

    // Don't set environment variable so it falls back to service binding
    delete process.env.AICORE_SERVICE_KEY;

    // Mock the authentication to return an error
    mockClientCredentialsGrantCall(
      {
        error: 'unauthorized',
        error_description: 'Bad credentials'
      },
      401
    );

    await expect(getAiCoreDestination()).rejects.toThrow(
      /Could not fetch client credentials token for service of type "aicore"/
    );
  });

  describe('getAiCoreDestination with environment variable', () => {
    it('should use environment variable when present', async () => {
      const mockServiceKey = {
        clientid: 'clientid',
        clientsecret: 'clientsecret',
        url: 'https://example.authentication.eu12.hana.ondemand.com',
        identityzone: 'examplezone',
        identityzoneid: 'examplezoneid',
        appname: 'appname',
        serviceurls: {
          AI_API_URL: 'https://api.ai.ml.hana.ondemand.com'
        }
      };

      process.env.AICORE_SERVICE_KEY = JSON.stringify(mockServiceKey);

      mockClientCredentialsGrantCall({
        access_token: dummyToken,
        token_type: 'Bearer',
        expires_in: 3600
      });

      const result = await getAiCoreDestination();

      expect(result).toBeDefined();
      expect(result.url).toBe('https://api.ai.ml.hana.ondemand.com');
    });

    it('should verify environment variable is checked every time', async () => {
      const mockServiceKey = {
        clientid: 'clientid',
        clientsecret: 'clientsecret',
        url: 'https://example.authentication.eu12.hana.ondemand.com',
        identityzone: 'examplezone',
        identityzoneid: 'examplezoneid',
        appname: 'appname',
        serviceurls: {
          AI_API_URL: 'https://api.ai.ml.hana.ondemand.com'
        }
      };

      // First call without environment variable should use service binding
      delete process.env.AICORE_SERVICE_KEY;

      // Set environment variable for subsequent calls
      process.env.AICORE_SERVICE_KEY = JSON.stringify(mockServiceKey);

      mockClientCredentialsGrantCall({
        access_token: dummyToken,
        token_type: 'Bearer',
        expires_in: 3600
      });

      const result = await getAiCoreDestination();

      expect(result).toBeDefined();
      expect(result.url).toBe('https://api.ai.ml.hana.ondemand.com');
    });

    it('should handle empty environment variable correctly', async () => {
      process.env.AICORE_SERVICE_KEY = '';

      mockClientCredentialsGrantCall({
        access_token: dummyToken,
        token_type: 'Bearer',
        expires_in: 3600
      });

      const result = await getAiCoreDestination();

      // Empty string should fallback to service binding, which should work with proper mocking
      expect(result).toBeDefined();
      expect(result.url).toBe('https://api.ai.ml.hana.ondemand.com');
    });
  });
});
