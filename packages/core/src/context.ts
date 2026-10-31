import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

import {
  assertHttpDestination,
  getServiceBinding,
  transformServiceBindingToDestination,
  useOrFetchDestination
} from '@sap-cloud-sdk/connectivity';
import { createLogger } from '@sap-cloud-sdk/util';

import type {
  HttpDestination,
  HttpDestinationOrFetchOptions,
  Service,
  ServiceCredentials
} from '@sap-cloud-sdk/connectivity';

const logger = createLogger({
  package: 'core',
  messageContext: 'context'
});

// Default HTTP agent socket timeout for AI Core requests (1,200s + 1s leeway), overriding the
// Cloud SDK default of 5s, which is too short for chat/streaming completions.
const DEFAULT_AGENT_TIMEOUT = 1_200_000 + 1e3;

// Disabled so the long timeout above does not keep stale pooled sockets alive past
// a load balancer's idle timeout, which would cause ECONNRESET on reuse.
// TODO: revisit if we switch HTTP library (e.g. undici / a fetch adapter), which can
// isolate the idle free-socket timeout from the active-request timeout and make
// keep-alive safe here.
const DEFAULT_AGENT_KEEP_ALIVE = false;

let aiCoreServiceBinding: Service | undefined;

/**
 * Returns a destination object.
 * @param destination - The destination to use for the request.
 * @returns The destination object.
 */
export async function getAiCoreDestination(
  destination?: HttpDestinationOrFetchOptions
): Promise<HttpDestination> {
  // If Destination is provided, get the destination and return it.
  if (destination) {
    // If fetch options provided, by default cache the destination.
    if (
      destination.destinationName !== undefined &&
      destination.useCache === undefined
    ) {
      destination.useCache = true;
    }

    const resolvedDestination = await useOrFetchDestination(destination);
    if (!resolvedDestination) {
      throw new Error('Could not resolve destination.');
    }
    assertHttpDestination(resolvedDestination);
    return resolvedDestination;
  }

  // Otherwise, get the destination from env or service binding with default service name "aicore".
  if (!aiCoreServiceBinding) {
    aiCoreServiceBinding = resolveAiCoreServiceBinding();
    if (!aiCoreServiceBinding) {
      throw new Error(
        'Could not find service credentials for AI Core. Please check the service binding.'
      );
    }
  }

  const aiCoreDestination = (await transformServiceBindingToDestination(
    aiCoreServiceBinding,
    {
      useCache: true
    }
  )) as HttpDestination;
  return {
    ...aiCoreDestination,
    agentOptions: {
      keepAlive: DEFAULT_AGENT_KEEP_ALIVE,
      timeout: DEFAULT_AGENT_TIMEOUT,
      ...aiCoreDestination.agentOptions
    }
  };
}

/**
 * Resolves the AI Core service binding based on the defined precedence:
 * 1. AICORE_SERVICE_KEY environment variable (full service key JSON)
 * 2. VCAP_SERVICES binding (via getServiceBinding('aicore'))
 * 3. Individual environment variables (AICORE_SERVICE_URL/AICORE_BASE_URL, AICORE_TOKEN_URL/AICORE_AUTH_URL, AICORE_CLIENT_ID, AICORE_CLIENT_SECRET)
 * 4. Configuration file ~/.aicore/config.json (or AICORE_CONFIG_FILE)
 * @internal
 */
export function resolveAiCoreServiceBinding(): Service | undefined {
  return (
    getAiCoreServiceKeyFromEnv() ||
    getServiceBinding('aicore') ||
    getAiCoreCredentialsFromEnvVars() ||
    getAiCoreCredentialsFromConfigFile()
  );
}

/**
 * Resets the cached AI Core service binding.
 * @internal
 */
export function resetAiCoreServiceBinding(): void {
  aiCoreServiceBinding = undefined;
}

function getAiCoreServiceKeyFromEnv(): Service | undefined {
  const credentials = parseServiceKeyFromEnv(process.env['AICORE_SERVICE_KEY']);
  if (credentials) {
    logger.debug(
      'Found a service key in environment variable "AICORE_SERVICE_KEY".'
    );
    return {
      credentials,
      label: 'aicore',
      name: 'aicore',
      tags: ['aicore']
    };
  }
}

function getAiCoreCredentialsFromEnvVars(): Service | undefined {
  const serviceUrl =
    process.env['AICORE_SERVICE_URL'] || process.env['AICORE_BASE_URL'];
  const tokenUrl =
    process.env['AICORE_TOKEN_URL'] || process.env['AICORE_AUTH_URL'];
  const clientId = process.env['AICORE_CLIENT_ID'];
  const clientSecret = process.env['AICORE_CLIENT_SECRET'];

  if (serviceUrl && tokenUrl && clientId && clientSecret) {
    logger.debug(
      'Found individual credentials in environment variables (AICORE_SERVICE_URL/AICORE_BASE_URL, AICORE_TOKEN_URL/AICORE_AUTH_URL, AICORE_CLIENT_ID, AICORE_CLIENT_SECRET).'
    );
    return {
      credentials: {
        clientid: clientId,
        clientsecret: clientSecret,
        url: tokenUrl,
        serviceurls: {
          AI_API_URL: serviceUrl
        }
      },
      label: 'aicore',
      name: 'aicore',
      tags: ['aicore']
    };
  }
}

function getAiCoreCredentialsFromConfigFile(): Service | undefined {
  try {
    const configPath =
      process.env['AICORE_CONFIG_FILE'] ||
      join(homedir(), '.aicore', 'config.json');

    if (existsSync(configPath)) {
      const raw = readFileSync(configPath, 'utf-8');
      const parsed = JSON.parse(raw);
      const serviceUrl =
        parsed.service_url || parsed.base_url || parsed.serviceurls?.AI_API_URL;
      const tokenUrl = parsed.token_url || parsed.auth_url || parsed.url;
      const clientId = parsed.client_id || parsed.clientid;
      const clientSecret = parsed.client_secret || parsed.clientsecret;

      if (serviceUrl && tokenUrl && clientId && clientSecret) {
        logger.debug(
          `Found AI Core credentials in configuration file at "${configPath}".`
        );
        return {
          credentials: {
            clientid: clientId,
            clientsecret: clientSecret,
            url: tokenUrl,
            serviceurls: {
              AI_API_URL: serviceUrl
            }
          },
          label: 'aicore',
          name: 'aicore',
          tags: ['aicore']
        };
      }
    }
  } catch (err) {
    logger.warn(
      `Failed to load AI Core configuration file: ${(err as Error).message}`
    );
  }
}

function parseServiceKeyFromEnv(
  aiCoreEnv: string | undefined
): ServiceCredentials | undefined {
  if (aiCoreEnv) {
    try {
      return JSON.parse(aiCoreEnv);
    } catch (err) {
      throw new Error(
        'Error in parsing service key from the "AICORE_SERVICE_KEY" environment variable.',
        { cause: err }
      );
    }
  }
}
