import fs from 'fs';
import path from 'path';
import { HttpDestination } from '@sap-cloud-sdk/connectivity';
import nock from 'nock';
import {
  EndpointOptions
} from '../src/core/http-client.js';

export function mockInference(stub: {
  request: {
    endpoint: EndpointOptions,
    destination: HttpDestination,
    data?: any,
    query?: Record<string, string>;
  },
  response: {
    status: number;
    data?: any;
  }}
): nock.Scope {

  return nock(stub.request.destination.url, {
    reqheaders: {
      'ai-resource-group': 'default',
      authorization: `Bearer ${stub.request.destination.authTokens?.[0].value}`
    }
  })
    .post(
      `/v2/inference/deployments/${stub.request.endpoint.deploymentId!}/${stub.request.endpoint.path}`,
      stub.request.data
    )
    .query(stub.request.query || {})
    .reply(stub.response.status, stub.response.data);
}

export function parseMockResponse<T>(client: string, fileName: string): T {
  const fileContent = fs.readFileSync(
    path.join('test-util', 'mock-data', client, fileName),
    'utf-8'
  );

  return JSON.parse(fileContent);
}
