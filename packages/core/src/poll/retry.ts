import { setTimeout as delay } from 'node:timers/promises';

import { isErrorWithCause } from '@sap-cloud-sdk/util';

import type { HttpMiddleware } from '@sap-cloud-sdk/http-client';

const DEFAULT_BASE_INTERVAL_MS = 60_000;
const DEFAULT_FACTOR = 2;
const DEFAULT_MAX_CONSECUTIVE_ERRORS = 5;
// Ignore a Retry-After larger than this (e.g. a bogus far-future HTTP-date); fall back to backoff.
const MAX_RETRY_AFTER_MS = 24 * 60 * 60 * 1_000;

/**
 * Exponential backoff configuration for the wait between polls. The wait before poll `n` is
 * `min(baseIntervalMs * factor ** (n - 1) [× jitter], maxIntervalMs)`, where jitter is a
 * random factor in `[1, 2)` applied when `randomize` is set. Defaults mirror
 * `async-retry`/`node-retry` (factor 2, jitter on).
 */
export interface Backoff {
  /** Base wait before the first retry, in milliseconds. Defaults to 60,000. */
  baseIntervalMs?: number;
  /** Exponential multiplier applied per poll. Defaults to 2. */
  factor?: number;
  /** Upper bound for a single wait, in milliseconds (applied after jitter). Defaults to unbounded. */
  maxIntervalMs?: number;
  /** Add random jitter (×[1, 2)) to each wait to avoid a thundering herd. Defaults to true. */
  randomize?: boolean;
}

// Computes the backoff wait for a 1-based attempt; the max bound is applied after jitter.
export function nextInterval(
  backoff: Backoff | undefined,
  attempt: number
): number {
  const base = backoff?.baseIntervalMs ?? DEFAULT_BASE_INTERVAL_MS;
  const factor = backoff?.factor ?? DEFAULT_FACTOR;
  const randomize = backoff?.randomize ?? true;
  const raw = base * factor ** Math.max(attempt - 1, 0);
  const jittered = randomize ? raw * (1 + Math.random()) : raw;
  return Math.min(jittered, backoff?.maxIntervalMs ?? jittered);
}

// Sleeps for `ms`, rejecting if the signal aborts.
export async function sleep(ms: number, signal: AbortSignal): Promise<void> {
  await delay(Math.max(ms, 0), undefined, { signal });
}

// Rejects a backoff whose numbers would produce a zero/NaN wait and busy-loop the poll against
// AI Core. `baseIntervalMs: 0` is allowed (an explicit no-delay cadence); a shrinking factor is
// not. Mirrors the `timeoutMs` input validation in waitUntilDone.
export function validateBackoff(backoff: Backoff | undefined): void {
  if (!backoff) {
    return;
  }
  const { baseIntervalMs, factor, maxIntervalMs } = backoff;
  if (
    baseIntervalMs !== undefined &&
    (!Number.isFinite(baseIntervalMs) || baseIntervalMs < 0)
  ) {
    throw new RangeError(
      `backoff.baseIntervalMs must be a non-negative, finite number, got ${baseIntervalMs}.`
    );
  }
  if (factor !== undefined && (!Number.isFinite(factor) || factor < 1)) {
    throw new RangeError(
      `backoff.factor must be a finite number >= 1, got ${factor}.`
    );
  }
  if (
    maxIntervalMs !== undefined &&
    (!Number.isFinite(maxIntervalMs) || maxIntervalMs <= 0)
  ) {
    throw new RangeError(
      `backoff.maxIntervalMs must be a positive, finite number, got ${maxIntervalMs}.`
    );
  }
}

// The AI Core http-client wraps failures in ErrorWithCause; rootCause is the underlying axios
// error, which carries the HTTP response (status/headers) and the network error code. Inside a
// retry middleware the error is the raw axios error instead, so unwrap only when wrapped.
interface HttpErrorShape {
  response?: { status?: number; headers?: Record<string, unknown> };
  code?: string;
}

function rootCauseOf(error: unknown): HttpErrorShape | undefined {
  const root =
    error instanceof Error && isErrorWithCause(error) ? error.rootCause : error;
  return root !== null && typeof root === 'object' ? root : undefined;
}

export function httpStatus(error: unknown): number | undefined {
  const status = rootCauseOf(error)?.response?.status;
  return typeof status === 'number' ? status : undefined;
}

function errorCode(error: unknown): string | undefined {
  const code = rootCauseOf(error)?.code;
  return typeof code === 'string' ? code : undefined;
}

// Reads a `Retry-After` header (delta-seconds or HTTP-date) from a thrown error, in ms.
// Absurd values are ignored so the backoff takes over instead.
function retryAfterMs(error: unknown): number | undefined {
  const raw = rootCauseOf(error)?.response?.headers?.['retry-after'];
  if (typeof raw !== 'string' && typeof raw !== 'number') {
    return undefined;
  }
  // A blank header (`Number('') === 0`) must not read as "retry immediately" — fall back to backoff.
  if (typeof raw === 'string' && raw.trim() === '') {
    return undefined;
  }
  const seconds = Number(raw);
  const ms = Number.isFinite(seconds)
    ? Math.max(seconds, 0) * 1_000
    : clampDate(Date.parse(String(raw)));
  if (ms === undefined || ms > MAX_RETRY_AFTER_MS) {
    return undefined;
  }
  return ms;
}

function clampDate(dateMs: number): number | undefined {
  return Number.isNaN(dateMs) ? undefined : Math.max(dateMs - Date.now(), 0);
}

function classifyError(error: unknown): 'retryable' | 'fatal' {
  const status = httpStatus(error);
  if (status === 429 || status === 502 || status === 503 || status === 504) {
    return 'retryable';
  }
  const code = errorCode(error);
  if (code === 'ECONNRESET' || code === 'ETIMEDOUT' || code === 'EAI_AGAIN') {
    return 'retryable';
  }
  return 'fatal';
}

/**
 * Options for {@link pollRetryMiddleware}.
 */
export interface RetryMiddlewareOptions {
  /** Backoff strategy used when the error carries no `Retry-After` hint. */
  backoff?: Backoff;
  /** Maximum consecutive retryable failures tolerated before the last error is propagated. Defaults to 5. */
  maxConsecutiveErrors?: number;
  /** Signal that cancels an in-flight wait between retries. */
  signal: AbortSignal;
}

/**
 * Builds an {@link HttpMiddleware} that retries transient request failures (status
 * `429/502/503/504` and the `ECONNRESET`/`ETIMEDOUT`/`EAI_AGAIN` network codes), honoring a
 * `Retry-After` header and otherwise backing off exponentially. A non-transient error, or one
 * past the consecutive-error ceiling, is rethrown unchanged.
 *
 * The stock `@sap-cloud-sdk/resilience` `retry()` cannot cover this case — it bails on every
 * `4xx` (so never retries `429`), ignores `Retry-After`, and has no configurable backoff.
 * @param options - Retry configuration.
 * @returns A middleware to inject via `requestConfig.middleware`.
 * @internal
 */
export function pollRetryMiddleware(
  options: RetryMiddlewareOptions
): HttpMiddleware {
  const {
    backoff,
    maxConsecutiveErrors = DEFAULT_MAX_CONSECUTIVE_ERRORS,
    signal
  } = options;
  return ({ fn }) =>
    async arg => {
      let consecutiveErrors = 0;
      for (;;) {
        signal.throwIfAborted();
        try {
          return await fn(arg);
        } catch (error) {
          if (classifyError(error) === 'fatal') {
            throw error;
          }
          consecutiveErrors += 1;
          if (consecutiveErrors > maxConsecutiveErrors) {
            throw error;
          }
          const hint = retryAfterMs(error);
          await sleep(hint ?? nextInterval(backoff, consecutiveErrors), signal);
        }
      }
    };
}
