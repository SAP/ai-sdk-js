import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nock from 'nock';
import {
  registerDestination,
  type DestinationAuthToken,
  type HttpDestination,
  type ServiceCredentials
} from '@sap-cloud-sdk/connectivity';
import { type EndpointOptions } from '@sap-ai-sdk/core';
import {
  type FoundationModel,
  type DeploymentResolutionOptions
} from '@sap-ai-sdk/ai-api/internal.js';
import { dummyToken } from './mock-jwt.js';

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const aiCoreDestination = {
  url: 'https://api.ai.ml.hana.ondemand.com'
};

export const aiCoreServiceBinding = {
  label: 'aicore',
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

const mockEndpoint: EndpointOptions = {
  url: 'mock-endpoint',
  apiVersion: 'mock-api-version'
};

export function createDestinationTokens(
  token: string = dummyToken,
  expiresIn?: string
): { authTokens: DestinationAuthToken[] } {
  return {
    authTokens: [
      {
        value: token,
        type: 'bearer',
        expiresIn,
        http_header: { key: 'authorization', value: `Bearer ${token}` },
        error: null
      }
    ]
  };
}

/**
 * @internal
 */
export function getMockedAiCoreDestination(
  destination = aiCoreDestination
): HttpDestination {
  const mockDestination: HttpDestination = {
    ...destination,
    authentication: 'OAuth2ClientCredentials',
    ...createDestinationTokens()
  };
  return mockDestination;
}

export function mockClientCredentialsGrantCall(
  response: any = { access_token: dummyToken },
  responseCode: number = 200,
  serviceCredentials: ServiceCredentials = aiCoreServiceBinding.credentials,
  delay = 0
): nock.Scope {
  return nock(serviceCredentials.url)
    .post('/oauth/token', {
      grant_type: 'client_credentials',
      client_id: serviceCredentials.clientid,
      client_secret: serviceCredentials.clientsecret
    })
    .delay(delay)
    .reply(responseCode, response);
}

export function mockInference(
  request: {
    data: any;
  },
  response: {
    data: any;
    status?: number;
  },
  endpoint: EndpointOptions = mockEndpoint,
  resilienceOptions?: {
    delay?: number;
    retry?: number;
  }
): nock.Scope {
  const { url, apiVersion, resourceGroup = 'default' } = endpoint;
  const destination = getMockedAiCoreDestination();
  const scope = nock(destination.url, {
    reqheaders: {
      'ai-resource-group': resourceGroup,
      authorization: `Bearer ${destination.authTokens?.[0].value}`
    }
  });

  let interceptor = scope.post(`/v2/${url}`, request.data).query(apiVersion ? { 'api-version': apiVersion } : {});

  if (resilienceOptions?.retry) {
    interceptor = interceptor.times(resilienceOptions.retry);
    if(resilienceOptions.delay) {
      interceptor = interceptor.delay(resilienceOptions.delay);
    }
    interceptor.reply(500);
    interceptor = scope.post(`/v2/${url}`, request.data).query(apiVersion ? { 'api-version': apiVersion } : {});
  }

  if (!resilienceOptions?.retry && resilienceOptions?.delay) {
    interceptor = interceptor.delay(resilienceOptions.delay);
  }

  return interceptor.reply(response.status, response.data);
}

/**
 * @internal
 */
export function mockDeploymentsList(
  opts: DeploymentResolutionOptions,
  ...deployments: { id: string; model?: FoundationModel }[]
): nock.Scope {
  const nockOpts = {
    reqheaders: {
      'ai-resource-group': opts?.resourceGroup ?? 'default'
    }
  };
  const query = {
    status: 'RUNNING',
    scenarioId: opts.scenarioId,
    ...(opts.executableId && { executableIds: [opts.executableId].toString() })
  };
  return nock(aiCoreDestination.url, nockOpts)
    .get('/v2/lm/deployments')
    .query(query)
    .reply(200, {
      resources: deployments.map(({ id, model }) => ({
        id,
        details: { resources: { backendDetails: { model } } }
      }))
    });
}

/**
 * @internal
 */
export async function parseFileToString(
  client: string,
  fileName: string
): Promise<string> {
  const fileContent = await readFile(
    path.join(__dirname, 'data', client, fileName),
    'utf-8'
  );
  return fileContent;
}

/**
 * @internal
 */
export async function parseMockResponse<T>(
  client: string,
  fileName: string
): Promise<T> {
  const fileContent = await readFile(
    path.join(__dirname, 'data', client, fileName),
    'utf-8'
  );
  return JSON.parse(fileContent);
}

/**
 * @internal
 */
export async function mockDestination() {
  registerDestination({
    name: 'aicore',
    url: 'http://example.com'
  });
}
