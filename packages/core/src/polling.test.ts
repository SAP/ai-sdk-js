import { describe, expect, it, vi } from 'vitest';

import {
  PollFailedError,
  PollTimeoutError,
  poll,
  waitUntilDone
} from './polling.ts';

import type { HttpResponse } from '@sap-cloud-sdk/http-client';

import type { OpenApiRequestBuilder } from './openapi-request-builder.ts';
import type { Backoff } from './polling.ts';

interface Status {
  status: 'PENDING' | 'ACTIVE' | 'ERROR';
}

function httpError(status: number, headers?: Record<string, string>): Error {
  return Object.assign(new Error(`HTTP ${status}`), { status, headers });
}

// A trigger builder whose executeRaw resolves (the 202 is not otherwise inspected).
function triggerStub(): OpenApiRequestBuilder<unknown> {
  return {
    executeRaw: vi.fn<() => Promise<HttpResponse>>(
      async () => ({ status: 202 }) as unknown as HttpResponse
    )
  } as unknown as OpenApiRequestBuilder<unknown>;
}

// A status builder whose execute() runs the given function on each poll.
function statusStub(
  execute: () => Promise<Status>
): OpenApiRequestBuilder<Status> {
  return {
    execute: vi.fn<() => Promise<Status>>(execute)
  } as unknown as OpenApiRequestBuilder<Status>;
}

function queued(...states: Status[]): () => Promise<Status> {
  const q = [...states];
  return async () => {
    const next = q.shift();
    if (!next) {
      throw new Error('status read called more times than expected');
    }
    return next;
  };
}

const isDone = (s: Status) => s.status === 'ACTIVE';
const isFailure = (s: Status) =>
  s.status === 'ERROR' ? 'resource failed' : undefined;

// No jitter and a zero base keep waits instant under real timers.
const noWait: Backoff = { baseIntervalMs: 0, randomize: false };

describe('waitUntilDone', () => {
  it('returns the resource once it reaches a terminal success state', async () => {
    const statusRequest = statusStub(
      queued({ status: 'PENDING' }, { status: 'ACTIVE' })
    );
    const result = await waitUntilDone(triggerStub(), {
      statusRequest,
      isDone,
      backoff: noWait
    });
    expect(result).toEqual({ status: 'ACTIVE' });
  });

  it('derives the status request from the trigger response (factory form)', async () => {
    const statusRequest = statusStub(
      queued({ status: 'PENDING' }, { status: 'ACTIVE' })
    );
    const factory = vi.fn<
      (created: HttpResponse) => OpenApiRequestBuilder<Status>
    >(() => statusRequest);
    const result = await waitUntilDone(triggerStub(), {
      statusRequest: factory,
      isDone,
      backoff: noWait
    });
    expect(result).toEqual({ status: 'ACTIVE' });
    expect(factory).toHaveBeenCalledOnce();
  });

  it('throws PollFailedError on a terminal failure state', async () => {
    const statusRequest = statusStub(queued({ status: 'ERROR' }));
    await expect(
      waitUntilDone(triggerStub(), {
        statusRequest,
        isDone,
        isFailure,
        backoff: noWait
      })
    ).rejects.toBeInstanceOf(PollFailedError);
  });

  it('resolves undefined on a 404 when notFound is resolve', async () => {
    const statusRequest = statusStub(async () => {
      throw httpError(404);
    });
    const result = await waitUntilDone(triggerStub(), {
      statusRequest,
      notFound: 'resolve',
      backoff: noWait
    });
    expect(result).toBeUndefined();
  });

  it('retries a retryable error and continues', async () => {
    let call = 0;
    const statusRequest = statusStub(async () => {
      call += 1;
      if (call === 1) {
        throw httpError(503);
      }
      return { status: 'ACTIVE' };
    });
    const result = await waitUntilDone(triggerStub(), {
      statusRequest,
      isDone,
      backoff: noWait
    });
    expect(result).toEqual({ status: 'ACTIVE' });
    expect(call).toBe(2);
  });

  it('propagates a fatal error immediately', async () => {
    const statusRequest = statusStub(async () => {
      throw httpError(403);
    });
    await expect(
      waitUntilDone(triggerStub(), { statusRequest, isDone, backoff: noWait })
    ).rejects.toMatchObject({ status: 403 });
  });

  it('propagates the error after the consecutive-error ceiling', async () => {
    let calls = 0;
    const statusRequest = statusStub(async () => {
      calls += 1;
      throw httpError(503);
    });
    await expect(
      waitUntilDone(triggerStub(), {
        statusRequest,
        isDone,
        backoff: noWait,
        maxConsecutiveErrors: 2
      })
    ).rejects.toMatchObject({ status: 503 });
    expect(calls).toBe(3);
  });

  it('invokes onPoll for each pending resource', async () => {
    const statusRequest = statusStub(
      queued({ status: 'PENDING' }, { status: 'PENDING' }, { status: 'ACTIVE' })
    );
    const seen: Status[] = [];
    await waitUntilDone(triggerStub(), {
      statusRequest,
      isDone,
      backoff: noWait,
      onPoll: s => seen.push(s)
    });
    expect(seen).toEqual([
      { status: 'PENDING' },
      { status: 'PENDING' },
      { status: 'ACTIVE' }
    ]);
  });

  it('waits with an exponential schedule between polls', async () => {
    vi.useFakeTimers();
    try {
      const times: number[] = [];
      const read = queued(
        { status: 'PENDING' },
        { status: 'PENDING' },
        { status: 'ACTIVE' }
      );
      const statusRequest = statusStub(async () => {
        times.push(Date.now());
        return read();
      });
      const promise = waitUntilDone(triggerStub(), {
        statusRequest,
        isDone,
        backoff: { baseIntervalMs: 1_000, factor: 2, randomize: false }
      });
      await vi.advanceTimersByTimeAsync(10_000);
      await promise;
      // Reads at 0, then +1000, then +2000.
      const t0 = times[0];
      expect(times.map(t => t - t0)).toEqual([0, 1_000, 3_000]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('applies maxIntervalMs as an upper bound after jitter', async () => {
    vi.useFakeTimers();
    try {
      const times: number[] = [];
      const read = queued({ status: 'PENDING' }, { status: 'ACTIVE' });
      const statusRequest = statusStub(async () => {
        times.push(Date.now());
        return read();
      });
      // raw=1000, jitter ×2 → 2000, capped at 1500. (If capped before jitter it would be 1000→2000.)
      const promise = waitUntilDone(triggerStub(), {
        statusRequest,
        isDone,
        backoff: {
          baseIntervalMs: 1_000,
          factor: 2,
          maxIntervalMs: 1_500,
          randomize: true,
          randomSource: () => 1
        }
      });
      await vi.advanceTimersByTimeAsync(5_000);
      await promise;
      const t0 = times[0];
      expect(times.map(t => t - t0)).toEqual([0, 1_500]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('honors a Retry-After header over the configured backoff', async () => {
    vi.useFakeTimers();
    try {
      let call = 0;
      const statusRequest = statusStub(async () => {
        call += 1;
        if (call === 1) {
          throw httpError(429, { 'retry-after': '2' });
        }
        return { status: 'ACTIVE' };
      });
      const promise = waitUntilDone(triggerStub(), {
        statusRequest,
        isDone,
        // A huge base would never resolve within 2s unless Retry-After (2s) takes precedence.
        backoff: { baseIntervalMs: 1_000_000, randomize: false }
      });
      await vi.advanceTimersByTimeAsync(2_000);
      await expect(promise).resolves.toEqual({ status: 'ACTIVE' });
      expect(call).toBe(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it('throws PollTimeoutError when the budget is exhausted', async () => {
    const statusRequest = statusStub(async () => ({ status: 'PENDING' }));
    await expect(
      waitUntilDone(triggerStub(), {
        statusRequest,
        isDone,
        timeoutMs: 30,
        backoff: { baseIntervalMs: 5, randomize: false }
      })
    ).rejects.toBeInstanceOf(PollTimeoutError);
  });

  it('throws immediately when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    let calls = 0;
    const statusRequest = statusStub(async () => {
      calls += 1;
      return { status: 'ACTIVE' };
    });
    await expect(
      waitUntilDone(triggerStub(), {
        statusRequest,
        isDone,
        signal: controller.signal,
        backoff: noWait
      })
    ).rejects.toThrow(/abort/i);
    expect(calls).toBe(0);
  });
});

describe('poll', () => {
  it('yields pending states and returns the terminal resource', async () => {
    const statusRequest = statusStub(
      queued({ status: 'PENDING' }, { status: 'PENDING' }, { status: 'ACTIVE' })
    );
    const yielded: Status[] = [];
    const iterator = poll<Status>(triggerStub(), { statusRequest, isDone });
    let next = await iterator.next();
    while (!next.done) {
      yielded.push(next.value);
      next = await iterator.next();
    }
    expect(yielded).toEqual([{ status: 'PENDING' }, { status: 'PENDING' }]);
    expect(next.value).toEqual({ status: 'ACTIVE' });
  });

  it('throws PollFailedError on a terminal failure state', async () => {
    const statusRequest = statusStub(queued({ status: 'ERROR' }));
    const iterator = poll<Status>(triggerStub(), {
      statusRequest,
      isDone,
      isFailure
    });
    await expect(iterator.next()).rejects.toBeInstanceOf(PollFailedError);
  });

  it('propagates a transient error without retrying (caller owns retries)', async () => {
    const statusRequest = statusStub(async () => {
      throw httpError(503);
    });
    const iterator = poll<Status>(triggerStub(), { statusRequest, isDone });
    await expect(iterator.next()).rejects.toMatchObject({ status: 503 });
  });

  it('lets the caller stop early', async () => {
    let calls = 0;
    const statusRequest = statusStub(async () => {
      calls += 1;
      return { status: 'PENDING' };
    });
    const iterator = poll<Status>(triggerStub(), { statusRequest, isDone });
    const first = await iterator.next();
    expect(first.value).toEqual({ status: 'PENDING' });
    await iterator.return(undefined);
    expect(calls).toBe(1);
  });
});
