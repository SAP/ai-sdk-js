import { transformServiceBindingToDestination } from '@sap-cloud-sdk/connectivity';

import nock from 'nock';
import { vi } from 'vitest';

import { mockClientCredentialsGrantCall } from '../../../test-util/mock-http.ts';
import { getAiCoreDestination } from './context.ts';

import type * as Connectivity from '@sap-cloud-sdk/connectivity';
import type { HttpDestination } from '@sap-cloud-sdk/connectivity';

// Keep the real Cloud SDK implementation by default (so the OAuth-failure test
// below still exercises the real transform + nock flow), but make
// transformServiceBindingToDestination overridable per test via mockResolvedValueOnce.
vi.mock('@sap-cloud-sdk/connectivity', async importOriginal => {
  const actual = await importOriginal<typeof Connectivity>();
  return {
    ...actual,
    transformServiceBindingToDestination: vi.fn(
      actual.transformServiceBindingToDestination
    )
  };
});

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

  it('should inject the default agent timeout for a client-secret service binding', async () => {
    mockClientCredentialsGrantCall();
    const destination = await getAiCoreDestination();
    expect(destination.agentOptions?.timeout).toBe(1201000);
    // Keep-alive is disabled to avoid stale-socket reuse with the long timeout.
    expect(destination.agentOptions?.keepAlive).toBe(false);
  });

  // Note: this mocks transformServiceBindingToDestination, so it verifies the
  // timeout injection on an mTLS-shaped destination, not the real Cloud SDK mTLS
  // transform path (which is verified by reading the shared merge logic).
  it('should inject the default agent timeout on an mTLS-shaped destination', async () => {
    vi.mocked(transformServiceBindingToDestination).mockResolvedValueOnce({
      url: 'https://api.ai.ml.hana.ondemand.com',
      authentication: 'ClientCertificateAuthentication',
      mtlsKeyPair: { cert: 'cert', key: 'key' }
    } as HttpDestination);
    const destination = await getAiCoreDestination();
    expect(destination.agentOptions?.timeout).toBe(1201000);
  });

  it('should return a user-provided destination unchanged without injecting agentOptions', async () => {
    const userDestination: HttpDestination = {
      url: 'https://user.example.com',
      authentication: 'NoAuthentication'
    };
    const destination = await getAiCoreDestination(userDestination);
    expect(destination.agentOptions).toBeUndefined();
  });

  it('should not overwrite pre-existing agent options on the service-binding destination', async () => {
    vi.mocked(transformServiceBindingToDestination).mockResolvedValueOnce({
      url: 'https://api.ai.ml.hana.ondemand.com',
      authentication: 'OAuth2ClientCredentials',
      agentOptions: { timeout: 60000, keepAlive: true }
    } as HttpDestination);
    const destination = await getAiCoreDestination();
    // A destination that already carries agentOptions wins over the injected defaults.
    expect(destination.agentOptions?.timeout).toBe(60000);
    expect(destination.agentOptions?.keepAlive).toBe(true);
  });
});
