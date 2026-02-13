import { createLogger, ErrorWithCause } from '@sap-cloud-sdk/util';
import {
  assertHttpDestination,
  getServiceBinding,
  transformServiceBindingToDestination,
  useOrFetchDestination
} from '@sap-cloud-sdk/connectivity';
import type {
  HttpDestination,
  Service,
  ServiceCredentials
} from '@sap-cloud-sdk/connectivity';
import type { DestinationResolvable } from './destination-provider-types.js';

const logger = createLogger({
  package: 'core',
  messageContext: 'context'
});

let aiCoreServiceBinding: Service | undefined;

/**
 * Resolves a destination for AI Core requests.
 * Accepts an HttpDestination, DestinationFetchOptions, or a provider function.
 * Falls back to the default AI Core service binding if no destination is provided.
 * @param destination - The destination to resolve. Can be an HttpDestination, fetch options, or a provider function.
 * @returns The resolved HttpDestination.
 */
export async function getAiCoreDestination(
  destination?: DestinationResolvable
): Promise<HttpDestination> {
  if (typeof destination === 'function') {
    try {
      const resolvedDestination = await destination();
      if (!resolvedDestination) {
        throw new Error(
          'Provider function returned null or undefined. Ensure the provider returns a valid HttpDestination object.'
        );
      }
      assertHttpDestination(resolvedDestination);
      return resolvedDestination;
    } catch (error) {
      throw new ErrorWithCause(
        'Failed to resolve destination from provider function.',
        error as Error
      );
    }
  }

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
  return aiCoreDestination;
}

function getAiCoreServiceKeyFromEnv(): Service | undefined {
  const credentials = parseServiceKeyFromEnv(process.env['AICORE_SERVICE_KEY']);
  if (credentials) {
    logger.info(
      'Found a service key in environment variable "AICORE_SERVICE_KEY". Using a service key is recommended for local testing only. Bind the AI Core service to the application for productive usage.'
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
