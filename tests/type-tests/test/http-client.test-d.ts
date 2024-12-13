import { expectError, expectType } from 'tsd';
import { executeRequest } from '@sap-ai-sdk/core';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';

expectType<Promise<HttpResponse>>(
  executeRequest({ url: 'https://example.com', apiVersion: '2024-10-21' }, {})
);

expectError<any>(executeRequest({}, { prompt: 'test prompt' }));

expectType<Promise<HttpResponse>>(
  executeRequest(
    { url: 'https://example.com', apiVersion: '2024-10-21' },
    {},
    { headers: { 'Content-Type': 'application/json' } }
  )
);

expectType<Promise<HttpResponse>>(
  executeRequest(
    { url: '/some-path', apiVersion: '2024-10-21' },
    {},
    { headers: { 'Content-Type': 'application/json' } },
    {
      destinationName: 'my-aicore-destination',
      useCache: false
    }
  )
);

expectType<Promise<HttpResponse>>(
  executeRequest(
    { url: 'https://example.com', apiVersion: '2024-10-21' },
    {},
    { headers: { 'Content-Type': 'application/json' } },
    {
      url: 'http://example.com'
    }
  )
);
