import { ErrorWithCause } from '@sap-cloud-sdk/util';

import { describe, expect, it, vi } from 'vitest';

import {
  PollFailedError,
  PollTimeoutError,
  poll,
  waitUntilDone
} from './index.ts';

import type {
  CustomRequestConfig,
  HttpMiddleware,
  HttpMiddlewareContext,
  HttpRequestConfig,
  HttpResponse
} from '@sap-cloud-sdk/http-client';

import type { OpenApiRequestBuilder } from '../openapi-request-builder.ts';
import type { PollStatus } from './index.ts';

interface Status {
  status: 'PENDING' | 'ACTIVE' | 'ERROR';
}

// Emulates how the http-client applies requestConfig.middleware: each middleware wraps the inner
// request fn (innermost last). Lets a test exercise the injected retry middleware end-to-end
// instead of bypassing it by stubbing builder.execute directly.
function executeWithMiddleware(
  cfg: CustomRequestConfig | undefined,
  inner: () => Promise<HttpResponse>
): Promise<HttpResponse> {
  const context: HttpMiddlewareContext = { uri: 'test', tenantId: undefined };
  let fn: (arg: HttpRequestConfig) => Promise<HttpResponse> = () => inner();
  for (const mw of (cfg?.middleware ?? []) as HttpMiddleware[]) {
    fn = mw({ fn, context });
  }
  return fn({} as HttpRequestConfig);
}

// An HTTP-shaped error the engine inspects via rootCause (plain error with a `response`).
function httpError(status: number, headers?: Record<string, string>): Error {
  return Object.assign(new Error(`HTTP ${status}`), {
    response: { status, headers }
  });
}

// A trigger whose executeRaw resolves to a 202 (not otherwise inspected).
function triggerStub(): OpenApiRequestBuilder<unknown> {
  return {
    executeRaw: vi
      .fn<() => Promise<HttpResponse>>()
      .mockResolvedValue({ status: 202 } as HttpResponse)
  } as unknown as OpenApiRequestBuilder<unknown>;
}

// A status builder whose `execute` is a Vitest mock the test configures. The mock accepts the
// destination and request config so a test can assert what the engine forwards.
function statusStub(): {
  builder: OpenApiRequestBuilder<Status>;
  execute: ReturnType<
    typeof vi.fn<
      (
        destination?: unknown,
        requestConfig?: CustomRequestConfig
      ) => Promise<Status>
    >
  >;
} {
  const execute =
    vi.fn<
      (
        destination?: unknown,
        requestConfig?: CustomRequestConfig
      ) => Promise<Status>
    >();
  return {
    builder: { execute } as unknown as OpenApiRequestBuilder<Status>,
    execute
  };
}

const checkStatus = (s: Status): PollStatus =>
  s.status === 'ACTIVE'
    ? 'done'
    : s.status === 'ERROR'
      ? { failed: 'resource failed' }
      : 'pending';

// No jitter and a zero base keep waits instant under real timers.
const backoff = { baseIntervalMs: 0, randomize: false };

describe('waitUntilDone', () => {
  it('returns the resource once checkStatus reports done', async () => {
    const { builder, execute } = statusStub();
    execute
      .mockResolvedValueOnce({ status: 'PENDING' })
      .mockResolvedValueOnce({ status: 'ACTIVE' });
    const result = await waitUntilDone(triggerStub(), {
      statusRequest: builder,
      checkStatus,
      backoff
    });
    expect(result).toEqual({ status: 'ACTIVE' });
    expect(execute).toHaveBeenCalledTimes(2);
  });

  it('throws PollFailedError when checkStatus reports a failure', async () => {
    const { builder, execute } = statusStub();
    execute.mockResolvedValue({ status: 'ERROR' });
    await expect(
      waitUntilDone(triggerStub(), {
        statusRequest: builder,
        checkStatus,
        backoff
      })
    ).rejects.toBeInstanceOf(PollFailedError);
  });

  it('resolves the status request from the trigger response (factory form)', async () => {
    const { builder, execute } = statusStub();
    execute.mockResolvedValue({ status: 'ACTIVE' });
    const factory = vi
      .fn<(created: HttpResponse) => OpenApiRequestBuilder<Status>>()
      .mockReturnValue(builder);
    const result = await waitUntilDone(triggerStub(), {
      statusRequest: factory,
      checkStatus,
      backoff
    });
    expect(result).toEqual({ status: 'ACTIVE' });
    expect(factory).toHaveBeenCalledOnce();
  });

  it('resolves undefined on a 404 when notFound is resolve', async () => {
    const { builder, execute } = statusStub();
    execute.mockRejectedValue(httpError(404));
    const result = await waitUntilDone(triggerStub(), {
      statusRequest: builder,
      checkStatus: () => 'pending',
      notFound: 'resolve',
      backoff
    });
    expect(result).toBeUndefined();
  });

  it('injects a retry middleware into the status request config', async () => {
    const { builder, execute } = statusStub();
    execute.mockResolvedValue({ status: 'ACTIVE' });
    await waitUntilDone(triggerStub(), {
      statusRequest: builder,
      checkStatus,
      backoff
    });
    const forwardedConfig = execute.mock.calls[0]?.[1];
    expect(forwardedConfig?.middleware).toHaveLength(1);
  });

  it('appends the retry middleware after a caller-provided one', async () => {
    const { builder, execute } = statusStub();
    execute.mockResolvedValue({ status: 'ACTIVE' });
    const callerMw = vi.fn<() => void>() as unknown as HttpMiddleware;
    await waitUntilDone(triggerStub(), {
      statusRequest: builder,
      checkStatus,
      backoff,
      requestConfig: { middleware: [callerMw] }
    });
    const forwarded = execute.mock.calls[0]?.[1];
    expect(forwarded?.middleware).toHaveLength(2);
    expect(forwarded?.middleware?.[0]).toBe(callerMw);
  });

  it('runs the injected middleware end-to-end so a transient error retries', async () => {
    const { builder, execute } = statusStub();
    const inner = vi
      .fn<() => Promise<HttpResponse>>()
      .mockRejectedValueOnce(httpError(503))
      .mockRejectedValueOnce(httpError(503))
      .mockResolvedValueOnce({
        status: 200,
        data: { status: 'ACTIVE' }
      } as HttpResponse);
    execute.mockImplementation(async (_dest, cfg) => {
      const response = await executeWithMiddleware(cfg, inner);
      return response.data as Status;
    });
    const result = await waitUntilDone(triggerStub(), {
      statusRequest: builder,
      checkStatus,
      backoff
    });
    expect(result).toEqual({ status: 'ACTIVE' });
    expect(inner).toHaveBeenCalledTimes(3);
  });

  it('forwards maxConsecutiveErrors to the middleware (ceiling honored end-to-end)', async () => {
    const { builder, execute } = statusStub();
    const inner = vi
      .fn<() => Promise<HttpResponse>>()
      .mockRejectedValue(httpError(503));
    execute.mockImplementation(async (_dest, cfg) => {
      const response = await executeWithMiddleware(cfg, inner);
      return response.data as Status;
    });
    await expect(
      waitUntilDone(triggerStub(), {
        statusRequest: builder,
        checkStatus,
        backoff,
        maxConsecutiveErrors: 1
      })
    ).rejects.toMatchObject({ response: { status: 503 } });
    // maxConsecutiveErrors: 1 → one retry then the ceiling trips: 2 calls. A regression dropping
    // the option would fall back to the default 5 → 6 calls.
    expect(inner).toHaveBeenCalledTimes(2);
  });

  it('resolves undefined on an ErrorWithCause-wrapped 404 when notFound is resolve', async () => {
    const { builder, execute } = statusStub();
    execute.mockRejectedValue(
      new ErrorWithCause('Request failed.', httpError(404))
    );
    const result = await waitUntilDone(triggerStub(), {
      statusRequest: builder,
      checkStatus: () => 'pending',
      notFound: 'resolve',
      backoff
    });
    expect(result).toBeUndefined();
  });

  it('rejects an invalid backoff', async () => {
    const { builder } = statusStub();
    await expect(
      waitUntilDone(triggerStub(), {
        statusRequest: builder,
        checkStatus,
        backoff: { factor: 0 }
      })
    ).rejects.toBeInstanceOf(RangeError);
  });

  it('rejects an invalid maxConsecutiveErrors', async () => {
    const { builder } = statusStub();
    await expect(
      waitUntilDone(triggerStub(), {
        statusRequest: builder,
        checkStatus,
        maxConsecutiveErrors: 0
      })
    ).rejects.toBeInstanceOf(RangeError);
  });

  it('propagates a fatal error immediately', async () => {
    // Engine-level: a rejecting status read propagates out of waitUntilDone. The middleware's
    // own fatal-vs-retryable classification is covered directly in retry.test.ts.
    const { builder, execute } = statusStub();
    execute.mockRejectedValue(httpError(403));
    await expect(
      waitUntilDone(triggerStub(), {
        statusRequest: builder,
        checkStatus,
        backoff
      })
    ).rejects.toMatchObject({ response: { status: 403 } });
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it('invokes onPoll for each polled resource', async () => {
    const { builder, execute } = statusStub();
    execute
      .mockResolvedValueOnce({ status: 'PENDING' })
      .mockResolvedValueOnce({ status: 'ACTIVE' });
    const onPoll = vi.fn<(resource: Status) => void>();
    await waitUntilDone(triggerStub(), {
      statusRequest: builder,
      checkStatus,
      backoff,
      onPoll
    });
    expect(onPoll).toHaveBeenCalledTimes(2);
    expect(onPoll).toHaveBeenNthCalledWith(1, { status: 'PENDING' });
    expect(onPoll).toHaveBeenNthCalledWith(2, { status: 'ACTIVE' });
  });

  it('throws PollTimeoutError when the budget is exhausted', async () => {
    const { builder, execute } = statusStub();
    execute.mockResolvedValue({ status: 'PENDING' });
    await expect(
      waitUntilDone(triggerStub(), {
        statusRequest: builder,
        checkStatus,
        timeoutMs: 40,
        backoff: { baseIntervalMs: 5, randomize: false }
      })
    ).rejects.toBeInstanceOf(PollTimeoutError);
  });

  it('rejects an invalid timeoutMs', async () => {
    const { builder } = statusStub();
    await expect(
      waitUntilDone(triggerStub(), {
        statusRequest: builder,
        checkStatus,
        timeoutMs: 0
      })
    ).rejects.toBeInstanceOf(RangeError);
  });

  it('throws immediately when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    const { builder, execute } = statusStub();
    await expect(
      waitUntilDone(triggerStub(), {
        statusRequest: builder,
        checkStatus,
        signal: controller.signal,
        backoff
      })
    ).rejects.toThrow(/abort/i);
    expect(execute).not.toHaveBeenCalled();
  });
});

describe('poll', () => {
  it('yields pending states and returns the terminal resource', async () => {
    const { builder, execute } = statusStub();
    execute
      .mockResolvedValueOnce({ status: 'PENDING' })
      .mockResolvedValueOnce({ status: 'PENDING' })
      .mockResolvedValueOnce({ status: 'ACTIVE' });
    const yielded: Status[] = [];
    const iterator = poll<Status>(triggerStub(), {
      statusRequest: builder,
      checkStatus
    });
    let next = await iterator.next();
    while (!next.done) {
      yielded.push(next.value);
      next = await iterator.next();
    }
    expect(yielded).toEqual([{ status: 'PENDING' }, { status: 'PENDING' }]);
    expect(next.value).toEqual({ status: 'ACTIVE' });
  });

  it('throws PollFailedError on a terminal failure', async () => {
    const { builder, execute } = statusStub();
    execute.mockResolvedValue({ status: 'ERROR' });
    const iterator = poll<Status>(triggerStub(), {
      statusRequest: builder,
      checkStatus
    });
    await expect(iterator.next()).rejects.toBeInstanceOf(PollFailedError);
  });

  it('propagates a transient error without retrying (caller owns retries)', async () => {
    const { builder, execute } = statusStub();
    execute.mockRejectedValue(httpError(503));
    const iterator = poll<Status>(triggerStub(), {
      statusRequest: builder,
      checkStatus
    });
    await expect(iterator.next()).rejects.toMatchObject({
      response: { status: 503 }
    });
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it('lets the caller stop early', async () => {
    const { builder, execute } = statusStub();
    execute.mockResolvedValue({ status: 'PENDING' });
    const iterator = poll<Status>(triggerStub(), {
      statusRequest: builder,
      checkStatus
    });
    const first = await iterator.next();
    expect(first.value).toEqual({ status: 'PENDING' });
    await iterator.return(undefined);
    expect(execute).toHaveBeenCalledTimes(1);
  });
});
