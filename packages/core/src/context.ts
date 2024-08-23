import { createLogger } from '@sap-cloud-sdk/util';
import {
  HttpDestination,
  Service,
  ServiceCredentials,
  getServiceBinding,
  transformServiceBindingToDestination
} from '@sap-cloud-sdk/connectivity';

const logger = createLogger({
  package: 'core',
  messageContext: 'context'
});

let aiCoreServiceBinding: Service | undefined;

/**
 * Returns a destination object from AI Core service binding.
 * @returns The destination object.
 */
export async function getAiCoreDestination(): Promise<HttpDestination> {
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
