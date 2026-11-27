import { ErrorWithCause } from '@sap-cloud-sdk/util';

import { describe, expect, it, vi } from 'vitest';

import { nextInterval, pollRetryMiddleware } from './retry.ts';

import type {
  HttpMiddlewareContext,
  HttpRequestConfig,
  HttpResponse
} from '@sap-cloud-sdk/http-client';

// A raw axios-shaped error (status/headers on `response`), as seen inside a middleware before
// the http-client wraps it in ErrorWithCause.
function httpError(status: number, headers?: Record<string, string>): Error {
  return Object.assign(new Error(`HTTP ${status}`), {
    response: { status, headers }
  });
}

function networkError(code: string): Error {
  return Object.assign(new Error(code), { code });
}

const context: HttpMiddlewareContext = { uri: 'test', tenantId: undefined };
const arg = {} as HttpRequestConfig;
const ok = { status: 200 } as HttpResponse;

// No jitter and a zero base keep backoff waits instant under real timers.
const backoff = { baseIntervalMs: 0, randomize: false };

function wrap(
  fn: (arg: HttpRequestConfig) => Promise<HttpResponse>,
  options: {
    signal?: AbortSignal;
    maxConsecutiveErrors?: number;
    backoff?: { baseIntervalMs: number; randomize: boolean };
  } = {}
): (arg: HttpRequestConfig) => Promise<HttpResponse> {
  const { signal = new AbortController().signal, maxConsecutiveErrors } =
    options;
  return pollRetryMiddleware({
    signal,
    maxConsecutiveErrors,
    backoff: options.backoff ?? backoff
  })({ fn, context });
}

describe('pollRetryMiddleware', () => {
  it('retries a retryable HTTP error and resolves', async () => {
    const fn = vi
      .fn<(arg: HttpRequestConfig) => Promise<HttpResponse>>()
      .mockRejectedValueOnce(httpError(503))
      .mockResolvedValueOnce(ok);
    await expect(wrap(fn)(arg)).resolves.toBe(ok);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('retries a transient network error and resolves', async () => {
    const fn = vi
      .fn<(arg: HttpRequestConfig) => Promise<HttpResponse>>()
      .mockRejectedValueOnce(networkError('ECONNRESET'))
      .mockResolvedValueOnce(ok);
    await expect(wrap(fn)(arg)).resolves.toBe(ok);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('rethrows a non-transient error without retrying', async () => {
    const fn = vi
      .fn<(arg: HttpRequestConfig) => Promise<HttpResponse>>()
      .mockRejectedValue(httpError(403));
    await expect(wrap(fn)(arg)).rejects.toMatchObject({
      response: { status: 403 }
    });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('rethrows the last error past the consecutive-error ceiling', async () => {
    const fn = vi
      .fn<(arg: HttpRequestConfig) => Promise<HttpResponse>>()
      .mockRejectedValue(httpError(503));
    await expect(
      wrap(fn, { maxConsecutiveErrors: 2 })(arg)
    ).rejects.toMatchObject({ response: { status: 503 } });
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('waits for a Retry-After header before retrying', async () => {
    vi.useFakeTimers();
    try {
      const fn = vi
        .fn<(arg: HttpRequestConfig) => Promise<HttpResponse>>()
        .mockRejectedValueOnce(httpError(429, { 'retry-after': '2' }))
        .mockResolvedValueOnce(ok);
      // A large base would not resolve within 2s unless Retry-After (2s) takes precedence.
      const promise = wrap(fn, {
        backoff: { baseIntervalMs: 1_000_000, randomize: false }
      })(arg);
      await vi.advanceTimersByTimeAsync(2_000);
      await expect(promise).resolves.toBe(ok);
      expect(fn).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it('classifies a transient error wrapped in ErrorWithCause', async () => {
    const fn = vi
      .fn<(arg: HttpRequestConfig) => Promise<HttpResponse>>()
      .mockRejectedValueOnce(
        new ErrorWithCause('Request failed.', httpError(503))
      )
      .mockResolvedValueOnce(ok);
    await expect(wrap(fn)(arg)).resolves.toBe(ok);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('ignores an oversized Retry-After and falls back to backoff', async () => {
    vi.useFakeTimers();
    try {
      // ~11.5 days, past the 24h cap: the engine must fall back to the backoff interval,
      // not sleep for the header value.
      const fn = vi
        .fn<(arg: HttpRequestConfig) => Promise<HttpResponse>>()
        .mockRejectedValueOnce(httpError(503, { 'retry-after': '999999' }))
        .mockResolvedValueOnce(ok);
      const promise = wrap(fn, {
        backoff: { baseIntervalMs: 50, randomize: false }
      })(arg);
      await vi.advanceTimersByTimeAsync(50);
      await expect(promise).resolves.toBe(ok);
      expect(fn).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it('throws without calling fn when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    const fn = vi.fn<(arg: HttpRequestConfig) => Promise<HttpResponse>>();
    await expect(wrap(fn, { signal: controller.signal })(arg)).rejects.toThrow(
      /abort/i
    );
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('nextInterval', () => {
  it('applies the max cap after jitter, not before', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.999);
    try {
      // base 100 × jitter(~2) = ~200, then capped to 150. A pre-jitter cap would yield ~100.
      expect(
        nextInterval(
          {
            baseIntervalMs: 100,
            factor: 1,
            randomize: true,
            maxIntervalMs: 150
          },
          1
        )
      ).toBe(150);
    } finally {
      spy.mockRestore();
    }
  });

  it('grows by factor on the exponent attempt - 1', () => {
    expect(
      nextInterval({ baseIntervalMs: 100, factor: 3, randomize: false }, 1)
    ).toBe(100);
    expect(
      nextInterval({ baseIntervalMs: 100, factor: 3, randomize: false }, 3)
    ).toBe(900);
  });
});
