import fs from 'fs';
import path from 'path';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import nock from 'nock';
import {
  EndpointOptions
} from '../src/core/http-client.js';

export function mockInference(
  request: {
    endpoint: EndpointOptions,
    destination: HttpDestination,
    data?: any,
    query?: Record<string, string>;
  },
  response: {
    status: number;
    data?: any;
  }
): nock.Scope {

  return nock(request.destination.url, {
    reqheaders: {
      'ai-resource-group': 'default',
      authorization: `Bearer ${request.destination.authTokens?.[0].value}`
    }
  })
    .post(
      `/v2/inference/deployments/${request.endpoint.deploymentId!}/${request.endpoint.path}`,
      request.data
    )
    .query(request.query || {})
    .reply(response.status, response.data);
}

export function parseMockResponse<T>(client: string, fileName: string): T {
  const fileContent = fs.readFileSync(
    path.join('test-util', 'mock-data', client, fileName),
    'utf-8'
  );

  return JSON.parse(fileContent);
}
