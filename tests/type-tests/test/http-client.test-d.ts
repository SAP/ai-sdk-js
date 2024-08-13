import { HttpResponse } from '@sap-cloud-sdk/http-client';
import { expectError, expectType } from 'tsd';
import { executeRequest } from '@sap-ai-sdk/core';

expectType<Promise<HttpResponse>>(
  executeRequest(
    { url: 'https://example.com', apiVersion: 'v1' },
    { deploymentConfiguration: { deploymentId: 'id' }, prompt: 'test prompt' },
    { headers: { 'Content-Type': 'application/json' } }
  )
);

expectError<any>(
  executeRequest(
    { url: 'https://example.com', apiVersion: 'v1' },
    { prompt: 'test prompt' }
  )
);

expectError<any>(
  executeRequest(
    {},
    { deploymentConfiguration: { deploymentId: 'id' }, prompt: 'test prompt' }
  )
);
