import { AgentsApi } from '@sap-ai-sdk/pab';
import { decodeJwt, registerDestination, serviceToken } from '@sap-cloud-sdk/connectivity';
import type { Destination, DestinationWithName, Service, ServiceBindingTransformOptions } from '@sap-cloud-sdk/connectivity';

function buildClientCredentialsDestination(
  token: string,
  url: string,
  name: string
): Destination {
  const expirationTime = decodeJwt(token).exp;
  const expiresIn = expirationTime
    ? Math.floor((expirationTime * 1000 - Date.now()) / 1000).toString(10)
    : undefined;
  return {
    url,
    name,
    authentication: 'OAuth2ClientCredentials',
    authTokens: [
      {
        value: token,
        type: 'bearer',
        expiresIn,
        http_header: { key: 'Authorization', value: `Bearer ${token}` },
        error: null
      }
    ]
  };
}

async function pabToDestination(
  service: Service,
  options: ServiceBindingTransformOptions
): Promise<Destination> {
  const transformedService = {
    ...service,
    credentials: { ...service.credentials.uaa }
  };

  const token = await serviceToken(transformedService, options);
  return buildClientCredentialsDestination(
    token,
    service.credentials.service_urls.agent_api_url,
    service.name
  );
}

/**
 * Get AI models from the PAB.
 * @returns List of AI models.
 */
export async function getAiModels(): Promise<any> {
  if (!process.env.PAB_SERVICE_KEY) {
    throw new Error('PAB_SERVICE_KEY is not set');
  }
  const credentials = JSON.parse(process.env.PAB_SERVICE_KEY);

  const service = {
    credentials,
    label: 'pab',
    name: 'pab',
    tags: ['pab']
  };

  const pabDestination = (await pabToDestination(service, {
    useCache: true
  })) as DestinationWithName;

  registerDestination({ ...pabDestination, url: pabDestination.url + 'api/v1' });

  return AgentsApi.getAgents({
    $top: 1
  }).execute({
    destinationName: 'pab'
  });
}
