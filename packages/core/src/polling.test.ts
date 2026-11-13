import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  PollTimeoutError,
  createAndWait,
  deleteAndWait,
  pollEach,
  pollUntilTerminal
} from './polling.ts';

import type { HttpResponse } from '@sap-cloud-sdk/http-client';

import type { OpenApiRequestBuilder } from './openapi-request-builder.ts';
import type { AsyncFlowDescriptor, PollEngineOptions } from './polling.ts';
import type { Mock } from 'vitest';

interface Status {
  status: 'PENDING' | 'ACTIVE' | 'ERROR' | 'PARTIAL';
}

function httpError(status: number): Error {
  return Object.assign(new Error(`HTTP ${status}`), { status });
}

describe('pollUntilTerminal', () => {
  let now: number;
  let sleep: Mock<(ms: number, signal?: AbortSignal) => Promise<void>>;

  beforeEach(() => {
    now = 0;
    vi.spyOn(Date, 'now').mockImplementation(() => now);
    // Injected sleep advances the mocked clock instead of waiting.
    sleep = vi.fn<(ms: number, signal?: AbortSignal) => Promise<void>>(
      async (ms: number) => {
        now += ms;
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function reads(
    ...states: Status[]
  ): (signal: AbortSignal) => Promise<Status> {
    const queue = [...states];
    return vi.fn<() => Promise<Status>>(async () => {
      const next = queue.shift();
      if (!next) {
        throw new Error('read called more times than expected');
      }
      return next;
    });
  }

  const base = {
    isComplete: (r: Status) => r.status === 'ACTIVE',
    getFailure: (r: Status) =>
      r.status === 'ERROR'
        ? ({ outcome: 'failure', reason: 'failed' } as const)
        : r.status === 'PARTIAL'
          ? ({ outcome: 'partial', reason: 'partial' } as const)
          : undefined,
    intervalMs: 1_000
  } satisfies Partial<PollEngineOptions<Status>>;

  it('returns success immediately when already complete, without sleeping', async () => {
    const read = reads({ status: 'ACTIVE' });
    const result = await pollUntilTerminal({ ...base, read, sleep });
    expect(result).toEqual({
      outcome: 'success',
      resource: { status: 'ACTIVE' }
    });
    expect(read).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('polls until complete', async () => {
    const read = reads(
      { status: 'PENDING' },
      { status: 'PENDING' },
      { status: 'ACTIVE' }
    );
    const result = await pollUntilTerminal({ ...base, read, sleep });
    expect(result.outcome).toBe('success');
    expect(read).toHaveBeenCalledTimes(3);
    expect(sleep).toHaveBeenCalledTimes(2);
  });

  it('returns a failure outcome and stops polling', async () => {
    const read = reads({ status: 'PENDING' }, { status: 'ERROR' });
    const result = await pollUntilTerminal({ ...base, read, sleep });
    expect(result).toEqual({
      outcome: 'failure',
      resource: { status: 'ERROR' },
      reason: 'failed'
    });
    expect(read).toHaveBeenCalledTimes(2);
  });

  it('returns a partial outcome for a terminal-with-errors state', async () => {
    const read = reads({ status: 'PARTIAL' });
    const result = await pollUntilTerminal({ ...base, read, sleep });
    expect(result).toEqual({
      outcome: 'partial',
      resource: { status: 'PARTIAL' },
      reason: 'partial'
    });
  });

  it('throws PollTimeoutError when the wall-clock budget is exhausted', async () => {
    const read = vi.fn<() => Promise<Status>>(async () => ({
      status: 'PENDING'
    }));
    await expect(
      pollUntilTerminal({
        ...base,
        read,
        sleep,
        maxWaitTime: 1_000,
        intervalMs: 400
      })
    ).rejects.toSatisfy(
      error => error instanceof PollTimeoutError && error.elapsedMs === 1_000
    );
  });

  it('keeps a fixed interval between polls', async () => {
    const read = reads(
      { status: 'PENDING' },
      { status: 'PENDING' },
      { status: 'ACTIVE' }
    );
    await pollUntilTerminal({ ...base, read, sleep, intervalMs: 1_000 });
    expect(sleep.mock.calls.map(c => c[0])).toEqual([1_000, 1_000]);
  });

  it('grows the interval when exponential backoff is opted in', async () => {
    const read = reads(
      { status: 'PENDING' },
      { status: 'PENDING' },
      { status: 'PENDING' },
      { status: 'ACTIVE' }
    );
    await pollUntilTerminal({
      ...base,
      read,
      sleep,
      intervalMs: 1_000,
      backoff: { kind: 'exponential' },
      maxWaitTime: 60_000
    });
    expect(sleep.mock.calls.map(c => c[0])).toEqual([1_000, 2_000, 4_000]);
  });

  it('honors a server retry hint over the configured interval', async () => {
    const read = reads({ status: 'PENDING' }, { status: 'ACTIVE' });
    await pollUntilTerminal({
      ...base,
      read,
      sleep,
      intervalMs: 1_000,
      getRetryAfter: hint =>
        (hint as Status).status === 'PENDING' ? 5_000 : undefined
    });
    expect(sleep).toHaveBeenCalledWith(5_000, expect.anything());
  });

  it('retries a retryable error and continues', async () => {
    let call = 0;
    const read = vi.fn<() => Promise<Status>>(async () => {
      call += 1;
      if (call === 1) {
        throw httpError(503);
      }
      return { status: 'ACTIVE' };
    });
    const result = await pollUntilTerminal({ ...base, read, sleep });
    expect(result.outcome).toBe('success');
    expect(read).toHaveBeenCalledTimes(2);
  });

  it('propagates the error after exceeding the consecutive-error ceiling', async () => {
    const read = vi.fn<() => Promise<Status>>(async () => {
      throw httpError(503);
    });
    await expect(
      pollUntilTerminal({
        ...base,
        read,
        sleep,
        maxConsecutiveErrors: 2,
        maxWaitTime: 1_000_000
      })
    ).rejects.toMatchObject({ status: 503 });
    expect(read).toHaveBeenCalledTimes(3);
  });

  it('propagates a fatal error immediately', async () => {
    const read = vi.fn<() => Promise<Status>>(async () => {
      throw httpError(403);
    });
    await expect(
      pollUntilTerminal({ ...base, read, sleep })
    ).rejects.toMatchObject({
      status: 403
    });
    expect(read).toHaveBeenCalledTimes(1);
  });

  it('clamps the sleep to the remaining budget (no overshoot)', async () => {
    const read = vi.fn<() => Promise<Status>>(async () => ({
      status: 'PENDING'
    }));
    await pollUntilTerminal({
      ...base,
      read,
      sleep,
      maxWaitTime: 1_000,
      intervalMs: 400
    }).catch(() => undefined);
    // 400, 400, then clamped to the remaining 200
    expect(sleep.mock.calls.map(c => c[0])).toEqual([400, 400, 200]);
  });

  it('throws immediately when the signal is already aborted', async () => {
    const read = vi.fn<() => Promise<Status>>();
    const controller = new AbortController();
    controller.abort();
    await expect(
      pollUntilTerminal({ ...base, read, sleep, signal: controller.signal })
    ).rejects.toThrow(/abort/i);
    expect(read).not.toHaveBeenCalled();
  });
});

describe('pollEach', () => {
  const base = {
    isComplete: (r: Status) => r.status === 'ACTIVE',
    intervalMs: 0,
    sleep: async () => undefined
  } satisfies Partial<PollEngineOptions<Status>>;

  it('yields every polled resource and returns the terminal result', async () => {
    const queue: Status[] = [
      { status: 'PENDING' },
      { status: 'PENDING' },
      { status: 'ACTIVE' }
    ];
    const read = vi.fn<() => Promise<Status>>(async () => queue.shift()!);
    const yielded: Status[] = [];
    const iterator = pollEach({ ...base, read });
    let next = await iterator.next();
    while (!next.done) {
      yielded.push(next.value);
      next = await iterator.next();
    }
    expect(yielded).toEqual([
      { status: 'PENDING' },
      { status: 'PENDING' },
      { status: 'ACTIVE' }
    ]);
    expect(next.value).toEqual({
      outcome: 'success',
      resource: { status: 'ACTIVE' }
    });
  });

  it('lets the caller stop early', async () => {
    const read = vi.fn<() => Promise<Status>>(async () => ({
      status: 'PENDING'
    }));
    const iterator = pollEach({ ...base, read });
    const first = await iterator.next();
    expect(first.value).toEqual({ status: 'PENDING' });
    await iterator.return(undefined as never);
    expect(read).toHaveBeenCalledTimes(1);
  });
});

describe('createAndWait / deleteAndWait', () => {
  function builderStub(): OpenApiRequestBuilder<unknown> {
    return {
      executeRaw: vi.fn<() => Promise<HttpResponse>>(
        async () =>
          ({
            status: 202,
            data: {},
            headers: {},
            request: {}
          }) as HttpResponse
      )
    } as unknown as OpenApiRequestBuilder<unknown>;
  }

  function statusBuilder(
    execute: () => Promise<Status>
  ): OpenApiRequestBuilder<Status> {
    return {
      execute: vi.fn<() => Promise<Status>>(execute)
    } as unknown as OpenApiRequestBuilder<Status>;
  }

  const descriptor = (
    execute: () => Promise<Status>
  ): AsyncFlowDescriptor<Status> => ({
    statusRead: () => statusBuilder(execute),
    isComplete: (s: Status) => s.status === 'ACTIVE',
    getFailure: (s: Status) =>
      s.status === 'ERROR'
        ? { outcome: 'failure', reason: 'failed' }
        : undefined
  });

  it('createAndWait polls the status read until complete', async () => {
    const queue: Status[] = [{ status: 'PENDING' }, { status: 'ACTIVE' }];
    const result = await createAndWait(
      builderStub(),
      descriptor(async () => queue.shift()!),
      { intervalMs: 0 }
    );
    expect(result).toEqual({
      outcome: 'success',
      resource: { status: 'ACTIVE' }
    });
  });

  it('deleteAndWait treats a 404 as deleted only when notFoundMeansDeleted is set', async () => {
    const result = await deleteAndWait(
      builderStub(),
      descriptor(async () => {
        throw httpError(404);
      }),
      { intervalMs: 0, notFoundMeansDeleted: true }
    );
    expect(result).toEqual({ outcome: 'success', resource: undefined });
  });

  it('deleteAndWait propagates a 404 when notFoundMeansDeleted is not set', async () => {
    await expect(
      deleteAndWait(
        builderStub(),
        descriptor(async () => {
          throw httpError(404);
        }),
        { intervalMs: 0 }
      )
    ).rejects.toMatchObject({ status: 404 });
  });
});
