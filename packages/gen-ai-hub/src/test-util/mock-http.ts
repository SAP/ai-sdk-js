import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import nock from 'nock';
import {
  BaseLlmParameters,
  CustomRequestConfig,
  EndpointOptions
} from '../core/http-client.js';

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockEndpoint: EndpointOptions = {
  url: 'mock-endpoint',
  apiVersion: 'mock-api-version'
};

export function mockInference<D extends BaseLlmParameters>(
  request: {
    data: D;
    requestConfig?: CustomRequestConfig;
  },
  response: {
    data: any;
    status?: number;
  },
  destination: HttpDestination,
  endpoint: EndpointOptions = mockEndpoint
): nock.Scope {
  const { deploymentConfiguration, ...body } = request.data;
  const { url, apiVersion } = endpoint;

  return nock(destination.url, {
    reqheaders: {
      'ai-resource-group': 'default',
      authorization: `Bearer ${destination.authTokens?.[0].value}`
    }
  })
    .post(
      `/v2/inference/deployments/${deploymentConfiguration.deploymentId}/${url}`,
      body as any
    )
    .query(apiVersion ? { 'api-version': apiVersion } : {})
    .reply(response.status, response.data);
}

export function parseMockResponse<T>(client: string, fileName: string): T {
  const fileContent = fs.readFileSync(
    path.join(__dirname, 'mock-data', client, fileName),
    'utf-8'
  );

  return JSON.parse(fileContent);
}
