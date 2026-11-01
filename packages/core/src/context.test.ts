import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeFileSync, unlinkSync } from 'node:fs';

import { transformServiceBindingToDestination } from '@sap-cloud-sdk/connectivity';

import nock from 'nock';
import { vi } from 'vitest';

import { mockClientCredentialsGrantCall } from '../../../test-util/mock-http.ts';
import {
  getAiCoreDestination,
  resolveAiCoreServiceBinding,
  resetAiCoreServiceBinding
} from './context.ts';

import type * as Connectivity from '@sap-cloud-sdk/connectivity';
import type { HttpDestination } from '@sap-cloud-sdk/connectivity';

// Keep the real Cloud SDK implementation by default (so the OAuth-failure test
// below still exercises the real transform + nock flow), but make
// transformServiceBindingToDestination overridable per test via mockResolvedValueOnce.
vi.mock('@sap-cloud-sdk/connectivity', async importOriginal => {
  const actual = await importOriginal<typeof Connectivity>();
  return {
    ...actual,
    transformServiceBindingToDestination: vi.fn<
      typeof actual.transformServiceBindingToDestination
    >(actual.transformServiceBindingToDestination)
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

  describe('credential resolution precedence', () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
      resetAiCoreServiceBinding();
      delete process.env.AICORE_SERVICE_KEY;
      delete process.env.AICORE_SERVICE_URL;
      delete process.env.AICORE_BASE_URL;
      delete process.env.AICORE_TOKEN_URL;
      delete process.env.AICORE_AUTH_URL;
      delete process.env.AICORE_CLIENT_ID;
      delete process.env.AICORE_CLIENT_SECRET;
      delete process.env.AICORE_CONFIG_FILE;
    });

    afterEach(() => {
      process.env = { ...originalEnv };
      resetAiCoreServiceBinding();
    });

    it('should resolve credentials from Python-SDK-compatible env vars (AICORE_BASE_URL & AICORE_AUTH_URL)', () => {
      process.env.AICORE_BASE_URL = 'https://api.ai.example.com';
      process.env.AICORE_AUTH_URL = 'https://auth.ai.example.com/oauth/token';
      process.env.AICORE_CLIENT_ID = 'my-client-id';
      process.env.AICORE_CLIENT_SECRET = 'my-client-secret';

      const binding = resolveAiCoreServiceBinding();
      expect(binding).toBeDefined();
      expect(binding?.credentials.clientid).toBe('my-client-id');
      expect(binding?.credentials.clientsecret).toBe('my-client-secret');
      expect(binding?.credentials.url).toBe(
        'https://auth.ai.example.com/oauth/token'
      );
      expect(binding?.credentials.serviceurls?.AI_API_URL).toBe(
        'https://api.ai.example.com'
      );
    });

    it('should resolve credentials from JS-SDK-native env vars (AICORE_SERVICE_URL & AICORE_TOKEN_URL)', () => {
      process.env.AICORE_SERVICE_URL = 'https://service.ai.example.com';
      process.env.AICORE_TOKEN_URL = 'https://token.ai.example.com/oauth/token';
      process.env.AICORE_CLIENT_ID = 'client-123';
      process.env.AICORE_CLIENT_SECRET = 'secret-123';

      const binding = resolveAiCoreServiceBinding();
      expect(binding).toBeDefined();
      expect(binding?.credentials.clientid).toBe('client-123');
      expect(binding?.credentials.clientsecret).toBe('secret-123');
      expect(binding?.credentials.url).toBe(
        'https://token.ai.example.com/oauth/token'
      );
      expect(binding?.credentials.serviceurls?.AI_API_URL).toBe(
        'https://service.ai.example.com'
      );
    });

    it('should resolve credentials from config file when AICORE_CONFIG_FILE is set', () => {
      const tempConfig = join(
        tmpdir(),
        `aicore-config-test-${Date.now()}.json`
      );
      writeFileSync(
        tempConfig,
        JSON.stringify({
          client_id: 'cfg-client',
          client_secret: 'cfg-secret',
          auth_url: 'https://cfg-auth.example.com/oauth/token',
          base_url: 'https://cfg-api.example.com'
        })
      );

      try {
        process.env.AICORE_CONFIG_FILE = tempConfig;
        const binding = resolveAiCoreServiceBinding();
        expect(binding).toBeDefined();
        expect(binding?.credentials.clientid).toBe('cfg-client');
        expect(binding?.credentials.clientsecret).toBe('cfg-secret');
        expect(binding?.credentials.url).toBe(
          'https://cfg-auth.example.com/oauth/token'
        );
        expect(binding?.credentials.serviceurls?.AI_API_URL).toBe(
          'https://cfg-api.example.com'
        );
      } finally {
        unlinkSync(tempConfig);
      }
    });

    it('should throw if no credentials can be found in any source', async () => {
      await expect(getAiCoreDestination()).rejects.toThrow(
        'Could not find service credentials for AI Core. Please check the service binding.'
      );
    });
  });
});
