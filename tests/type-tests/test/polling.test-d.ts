import {
  createAndWait,
  deleteAndWait,
  pollEach,
  pollUntilTerminal,
  PollTimeoutError
} from '@sap-ai-sdk/core';

import { expectAssignable, expectType } from 'tsd';

import type {
  AsyncFlowDescriptor,
  OpenApiRequestBuilder,
  PollResult
} from '@sap-ai-sdk/core';

interface Status {
  status: 'PENDING' | 'ACTIVE' | 'ERROR';
}

const engineOptions = {
  read: async () => ({ status: 'PENDING' }) as Status,
  isComplete: (s: Status) => s.status === 'ACTIVE'
};

// pollUntilTerminal infers the resource type into PollResult<Status>.
expectType<Promise<PollResult<Status>>>(pollUntilTerminal(engineOptions));

// pollEach yields Status and returns PollResult<Status>.
expectType<AsyncGenerator<Status, PollResult<Status>, void>>(
  pollEach(engineOptions)
);

// isComplete / getFailure receive the resource type, not unknown.
const descriptor: AsyncFlowDescriptor<Status> = {
  statusRead: () => ({}) as OpenApiRequestBuilder<Status>,
  isComplete: s => {
    expectType<Status>(s);
    return s.status === 'ACTIVE';
  },
  getFailure: s =>
    s.status === 'ERROR' ? { outcome: 'failure', reason: 'x' } : undefined
};

expectType<Promise<PollResult<Status>>>(
  createAndWait<Status>({} as OpenApiRequestBuilder<unknown>, descriptor)
);

// deleteAndWait widens the resource to include undefined (gone).
expectType<Promise<PollResult<Status | undefined>>>(
  deleteAndWait<Status>({} as OpenApiRequestBuilder<unknown>, descriptor)
);

// PollTimeoutError is an Error with elapsedMs.
const timeout = new PollTimeoutError(1000);
expectAssignable<Error>(timeout);
expectType<number>(timeout.elapsedMs);

// PollResult narrows on `outcome`.
declare const result: PollResult<Status>;
if (result.outcome === 'partial' || result.outcome === 'failure') {
  expectType<string>(result.reason);
}
