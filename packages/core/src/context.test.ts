import nock from 'nock';
import { transformServiceBindingToDestination } from '@sap-cloud-sdk/connectivity';
import {
  mockClientCredentialsGrantCall,
  aiCoreDestination,
  getMockedAiCoreDestination
} from '../../../test-util/mock-http.js';
import { getAiCoreDestination } from './context.js';
import type { HttpDestination } from '@sap-cloud-sdk/connectivity';
import type { DestinationProvider } from './destination-provider-types.js';

describe('context', () => {
  afterAll(() => {
    nock.cleanAll();
  });

  it('should throw if client credentials are not fetched', async () => {
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

  describe('DestinationProvider', () => {
    it('resolves destination from provider function', async () => {
      const mockDestination: HttpDestination = getMockedAiCoreDestination();
      const provider: DestinationProvider = () => mockDestination;

      const result = await getAiCoreDestination(provider);

      expect(result).toEqual(mockDestination);
    });

    it('resolves destination using transformServiceBindingToDestination', async () => {
      mockClientCredentialsGrantCall();

      const provider: DestinationProvider = async () => {
        const serviceBinding = {
          name: 'aicore',
          label: 'aicore',
          tags: ['aicore'],
          credentials: {
            clientid: 'clientid',
            clientsecret: 'clientsecret',
            url: 'https://example.authentication.eu12.hana.ondemand.com',
            identityzone: 'examplezone',
            identityzoneid: 'examplezoneid',
            appname: 'appname',
            serviceurls: {
              AI_API_URL: aiCoreDestination.url
            }
          }
        };
        return transformServiceBindingToDestination(serviceBinding, {
          useCache: true
        }) as Promise<HttpDestination>;
      };

      const result = await getAiCoreDestination(provider);

      expect(result.url).toBe(aiCoreDestination.url);
    });

    it('throws error when provider function throws', async () => {
      const provider: DestinationProvider = () => {
        throw new Error('Provider error');
      };

      await expect(getAiCoreDestination(provider)).rejects.toThrow(
        'Failed to resolve destination from provider function.'
      );
    });

    it('throws error when provider function returns undefined', async () => {
      const provider: DestinationProvider = () => undefined as any;

      await expect(getAiCoreDestination(provider)).rejects.toThrow(
        'Failed to resolve destination from provider function.'
      );
    });
  });
});
