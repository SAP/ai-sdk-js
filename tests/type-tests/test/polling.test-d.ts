import {
  poll,
  PollFailedError,
  PollTimeoutError,
  waitUntilDone
} from '@sap-ai-sdk/core';

import { expectAssignable, expectType } from 'tsd';

import type { OpenApiRequestBuilder } from '@sap-ai-sdk/core';
import type { HttpResponse } from '@sap-cloud-sdk/http-client';

interface Created {
  collectionURL: string;
}
interface Pending {
  monitorURL: string;
}
type Status = Created | Pending;

declare const trigger: OpenApiRequestBuilder<unknown>;
declare const statusRequest: OpenApiRequestBuilder<Status>;

// waitUntilDone resolves to the status type; T is inferred from statusRequest.
expectType<Promise<Status>>(
  waitUntilDone(trigger, { statusRequest, isDone: s => 'collectionURL' in s })
);

// A factory form derives the status request from the trigger's 202 response.
expectType<Promise<Status>>(
  waitUntilDone(trigger, {
    statusRequest: (created: HttpResponse) => {
      expectType<HttpResponse>(created);
      return statusRequest;
    },
    isDone: s => 'collectionURL' in s
  })
);

// With notFound: 'resolve' the result widens to include undefined.
expectType<Promise<Status | undefined>>(
  waitUntilDone(trigger, {
    statusRequest,
    notFound: 'resolve',
    isDone: s => 'collectionURL' in s
  })
);

// poll yields the status type and returns the status type (or undefined).
expectType<AsyncGenerator<Status, Status | undefined, void>>(
  poll(trigger, { statusRequest, isDone: s => 'collectionURL' in s })
);

// isDone receives the inferred status type, not unknown.
void waitUntilDone(trigger, {
  statusRequest,
  isDone: s => {
    expectType<Status>(s);
    return 'collectionURL' in s;
  }
});

// Error types.
const timeout = new PollTimeoutError(1000);
expectAssignable<Error>(timeout);
expectType<number>(timeout.elapsedMs);

const failed = new PollFailedError('reason', { status: 'ERROR' });
expectAssignable<Error>(failed);
expectType<unknown>(failed.resource);
