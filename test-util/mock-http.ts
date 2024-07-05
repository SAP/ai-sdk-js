import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import nock from 'nock';
import {
  BaseLlmParameters,
  CustomRequestConfig,
  EndpointOptions
} from '../packages/gen-ai-hub/src/core/http-client.js';

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
    headers?: Record<string, string>;
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
    .query({ 'api-version': apiVersion })
    .reply(response.status, response.data);
}
