import { createLogger } from '@sap-cloud-sdk/util';
import {
  Destination,
  Service,
  getServiceBinding,
  transformServiceBindingToDestination
} from '@sap-cloud-sdk/connectivity';

const logger = createLogger({
  package: 'gen-ai-hub',
  messageContext: 'context'
});

let aiCoreServiceBinding: Service | undefined;

/**
 * Returns a destination object from AI Core service binding.
 * @returns The destination object.
 */
export async function getAiCoreDestination(): Promise<Destination> {
  if (!aiCoreServiceBinding) {
    aiCoreServiceBinding =
      getAiCoreServiceKeyFromEnv() || getServiceBinding('aicore');
    if (!aiCoreServiceBinding) {
      throw new Error(
        'Could not find service credentials for AI Core. Please check the service binding.'
      );
    }
  }

  const aiCoreDestination = await transformServiceBindingToDestination(
    aiCoreServiceBinding,
    {
      useCache: true
    }
  );
  return aiCoreDestination;
}

function getAiCoreServiceKeyFromEnv(): Service | undefined {
  const credentials = parseServiceKeyFromEnv(process.env['aicore']);
  if (credentials) {
    logger.info(
      'Found a service key in environment variable "aicore". Using a service key is recommended for local testing only. Bind the AI Core service to the application for productive usage.'
    );
    return {
      credentials,
      label: 'aicore',
      name: 'aicore',
      tags: ['aicore']
    };
  }
}

function parseServiceKeyFromEnv(aiCoreEnv: string | undefined) {
  if (aiCoreEnv) {
    try {
      return JSON.parse(aiCoreEnv);
    } catch (err) {
      throw new Error(
        'Error in parsing service key from the "aicore" environment variable.',
        { cause: err }
      );
    }
  }
}
