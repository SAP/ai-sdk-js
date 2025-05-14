import { pab } from '@sap-ai-sdk/pab';
import { transformServiceBindingToClientCredentialsDestination } from '@sap-cloud-sdk/connectivity';
import type { HttpDestination, Service } from '@sap-cloud-sdk/connectivity';

async function getPabDestination(): Promise<HttpDestination> {
  if (!process.env.PAB_SERVICE_KEY) {
    throw new Error('PAB_SERVICE_KEY is not set');
  }
  const credentials = JSON.parse(process.env.PAB_SERVICE_KEY);
  const service: Service = {
    credentials: {
      ...credentials.uaa
    },
    label: 'pab',
    name: 'pab',
    tags: ['pab']
  };

  const destination =
    (await transformServiceBindingToClientCredentialsDestination(service, {
      useCache: true,
      url: credentials.service_urls.agent_api_url
    })) as HttpDestination;
  destination.url += 'api/v1';
  return destination;
}

/**
 * Get AI models from the PAB.
 * @returns List of AI models.
 */
export async function getAiModels(): Promise<any> {
  const destination = await getPabDestination();
  return pab().aiModelsApi.requestBuilder().getAll().execute(destination);
}
