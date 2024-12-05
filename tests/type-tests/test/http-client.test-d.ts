import { expectError, expectType } from 'tsd';
import { executeRequest } from '@sap-ai-sdk/core';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';

expectType<Promise<HttpResponse>>(
  executeRequest({ url: 'https://example.com', apiVersion: 'v1' }, {})
);

expectError<any>(executeRequest({}, { prompt: 'test prompt' }));

expectType<Promise<HttpResponse>>(
  executeRequest(
    { url: 'https://example.com', apiVersion: 'v1' },
    {},
    { headers: { 'Content-Type': 'application/json' } }
  )
);

expectType<Promise<HttpResponse>>(
  executeRequest(
    { url: 'https://example.com', apiVersion: 'v1' },
    {},
    { headers: { 'Content-Type': 'application/json' } },
    {
      destinationName: 'my-aicore-destination'
    }
  )
);

expectType<Promise<HttpResponse>>(
  executeRequest(
    { url: 'https://example.com', apiVersion: 'v1' },
    {},
    { headers: { 'Content-Type': 'application/json' } },
    {
      url: 'http://example.com'
    }
  )
);
