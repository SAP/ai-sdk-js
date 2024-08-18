import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DestinationAuthToken, HttpDestination, ServiceCredentials } from '@sap-cloud-sdk/connectivity';
import nock from 'nock';
import {
  BaseLlmParameters,
  CustomRequestConfig
} from '@sap-ai-sdk/core';
import { EndpointOptions } from '@sap-ai-sdk/core/src/http-client.js';
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

export function mockAiCoreEnvVariable(): void {
  process.env['AICORE_SERVICE_KEY'] = JSON.stringify(aiCoreServiceBinding.credentials);
}

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
    requestConfig?: CustomRequestConfig;
  },
  response: {
    data: any;
    status?: number;
  },
  endpoint: EndpointOptions = mockEndpoint
): nock.Scope {
  const { url, apiVersion } = endpoint;
  const destination = getMockedAiCoreDestination();
  return nock(destination.url, {
    reqheaders: {
      'ai-resource-group': 'default',
      authorization: `Bearer ${destination.authTokens?.[0].value}`
    }
  })
    .post(`/v2/${url}`,
      request.data
    )
    .query(apiVersion ? { 'api-version': apiVersion } : {})
    .reply(response.status, response.data);
}

/**
 * @internal
 */
export function parseMockResponse<T>(client: string, fileName: string): T {
  const fileContent = fs.readFileSync(
    path.join(__dirname, '..', 'packages', 'gen-ai-hub', 'test', client, fileName),
    'utf-8'
  );
  return JSON.parse(fileContent);
}
