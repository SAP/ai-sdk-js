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
    aiCoreServiceBinding =
      getAiCoreServiceKeyFromEnv() || getServiceBinding('aicore');
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
