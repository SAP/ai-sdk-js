import {
  poll,
  PollFailedError,
  PollTimeoutError,
  waitUntilDone
} from '@sap-ai-sdk/core';

import { expectAssignable, expectType } from 'tsd';

import type { OpenApiRequestBuilder, PollStatus } from '@sap-ai-sdk/core';
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
const checkStatus = (s: Status): PollStatus =>
  'collectionURL' in s ? 'done' : 'pending';

// waitUntilDone resolves to the status type; T is inferred from statusRequest.
expectType<Promise<Status>>(
  waitUntilDone(trigger, { statusRequest, checkStatus })
);

// A factory form derives the status request from the trigger's 202 response.
expectType<Promise<Status>>(
  waitUntilDone(trigger, {
    statusRequest: (created: HttpResponse) => {
      expectType<HttpResponse>(created);
      return statusRequest;
    },
    checkStatus
  })
);

// notFound: 'resolve' widens the result to include undefined.
expectType<Promise<Status | undefined>>(
  waitUntilDone(trigger, { statusRequest, checkStatus, notFound: 'resolve' })
);

// Sound for a typed variable too (not just an inline literal): a 'throw' | 'resolve'
// variable must resolve to Promise<Status | undefined>, never silently to Promise<Status>.
declare const nf: 'throw' | 'resolve';
expectType<Promise<Status | undefined>>(
  waitUntilDone(trigger, { statusRequest, checkStatus, notFound: nf })
);

// poll yields the status type and returns the status type (or undefined).
expectType<AsyncGenerator<Status, Status | undefined, void>>(
  poll(trigger, { statusRequest, checkStatus })
);

// Error types.
const timeout = new PollTimeoutError(1000);
expectAssignable<Error>(timeout);
expectType<number>(timeout.elapsedMs);

const failed = new PollFailedError('reason', { status: 'ERROR' });
expectAssignable<Error>(failed);
expectType<unknown>(failed.resource);
