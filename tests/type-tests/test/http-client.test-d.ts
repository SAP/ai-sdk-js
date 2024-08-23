import { HttpResponse } from '@sap-cloud-sdk/http-client';
import { expectError, expectType } from 'tsd';
import { executeRequest } from '@sap-ai-sdk/core';

expectType<Promise<HttpResponse>>(
  executeRequest(
    { url: 'https://example.com', apiVersion: 'v1' },
    { headers: { 'Content-Type': 'application/json' } }
  )
);

expectError<any>(executeRequest({}, { prompt: 'test prompt' }));
