import { PollFailedError } from './poll-failed-error.ts';
import { PollTimeoutError } from './poll-timeout-error.ts';

import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';
import type {
  CustomRequestConfig,
  HttpResponse
} from '@sap-cloud-sdk/http-client';

import type { OpenApiRequestBuilder } from './openapi-request-builder.ts';

export { PollFailedError, PollTimeoutError };

const DEFAULT_TIMEOUT_MS = 60 * 60 * 1_000;
const DEFAULT_BASE_INTERVAL_MS = 60_000;
const DEFAULT_FACTOR = 2;
const DEFAULT_MAX_CONSECUTIVE_ERRORS = 5;

// A unique sentinel (never equal to a resource of type T) marking that a `notFound: 'resolve'`
// status read observed a 404 — i.e. the resource is gone.
const GONE = Symbol('gone');

/**
 * Exponential backoff configuration for {@link waitUntilDone}. Defaults mirror the
 * widely-used `async-retry`/`node-retry` behaviour: a base wait, an exponential factor,
 * and random jitter. The wait before poll `n` is
 * `min(baseIntervalMs * factor ** (n - 1) [× jitter], maxIntervalMs)`, where jitter is a
 * random factor in `[1, 2)` applied when `randomize` is set.
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
  /** Random source in `[0, 1)`, for deterministic tests. Defaults to `Math.random`. */
  randomSource?: () => number;
}

/**
 * Options shared by {@link poll} and {@link waitUntilDone}.
 * @template T - The status resource type.
 */
export interface PollOptions<T> {
  /**
   * The request that reads the status, re-executed on each poll. Pass an
   * {@link OpenApiRequestBuilder} directly when the status id is already known, or a factory
   * that derives it from the trigger's `202` response (e.g. an id from the `Location` header)
   * when the id is server-assigned.
   */
  statusRequest:
    | OpenApiRequestBuilder<T>
    | ((created: HttpResponse) => OpenApiRequestBuilder<T>);
  /** Returns true once the resource has reached a successful terminal state. Defaults to `() => false`. */
  isDone?: (resource: T) => boolean;
  /** Returns a reason to throw a {@link PollFailedError} when the resource reached a terminal failure state. */
  isFailure?: (resource: T) => string | undefined;
  /** When `'resolve'`, a `404` from the status read completes with `undefined` (the resource is gone). */
  notFound?: 'throw' | 'resolve';
  /** The destination to execute the requests against. */
  destination?: HttpDestinationOrFetchOptions;
  /** Custom request configuration forwarded to the trigger and the status requests. */
  requestConfig?: CustomRequestConfig;
  /** Signal that cancels polling and any in-flight request. */
  signal?: AbortSignal;
}

/**
 * Options for {@link waitUntilDone}.
 * @template T - The status resource type.
 */
export interface WaitOptions<T> extends PollOptions<T> {
  /** Wall-clock budget in milliseconds before a {@link PollTimeoutError} is thrown. Defaults to one hour. */
  timeoutMs?: number;
  /** Backoff strategy for the wait between polls. Defaults to exponential + jitter over a 60s base. */
  backoff?: Backoff;
  /** Maximum number of consecutive retryable request errors tolerated before the last error is propagated. Defaults to 5. */
  maxConsecutiveErrors?: number;
  /** Called after each successful poll with the current resource. */
  onPoll?: (resource: T) => void;
}

// Builds the single status-read function: resolves the status request (a builder, or a
// factory applied to the trigger's 202 response) once, then re-executes it on each poll,
// mapping a resolved 404 to the GONE sentinel when the caller opted into `notFound: 'resolve'`.
function createStatusReader<T>(
  created: HttpResponse,
  options: PollOptions<T>
): (signal: AbortSignal) => Promise<T | typeof GONE> {
  const { statusRequest, notFound, destination, requestConfig } = options;
  const builder =
    typeof statusRequest === 'function'
      ? statusRequest(created)
      : statusRequest;
  return async signal => {
    try {
      return await builder.execute(destination, {
        ...requestConfig,
        signal
      });
    } catch (error) {
      if (notFound === 'resolve' && getHttpStatus(error) === 404) {
        return GONE;
      }
      throw error;
    }
  };
}

// Checks the terminal state of a resource: throws PollFailedError on a terminal failure,
// otherwise returns whether it is a terminal success. Keeps the success/failure branching in
// one place so callers only ask "done?". Named `check…` (not `is…`) because it can throw.
function checkTerminal<T>(resource: T, options: PollOptions<T>): boolean {
  const failure = options.isFailure?.(resource);
  if (failure !== undefined) {
    throw new PollFailedError(failure, resource);
  }
  return (options.isDone ?? (() => false))(resource);
}

/**
 * Polls an asynchronous operation as a pure state machine, without waiting between polls.
 *
 * The first `next()` runs the `trigger` request and performs the first status read; each
 * subsequent `next()` performs one more status read. Pending states are yielded, a terminal
 * failure throws a {@link PollFailedError}, and the terminal resource is returned when
 * `isDone` holds (or `undefined` when a `404` completes a `notFound: 'resolve'` flow).
 *
 * This generator never sleeps and does not retry transient request errors — the caller
 * controls the cadence and error handling. Use {@link waitUntilDone} for the common
 * "wait until done" case with backoff and retries.
 * @template T - The status resource type.
 * @param trigger - The request builder for the asynchronous operation (returns `202`).
 * @param options - Polling configuration.
 * @returns An async generator yielding each pending resource and returning the terminal resource.
 * @yields The resource observed on each pending poll.
 * @throws PollFailedError on a terminal failure state.
 */
export async function* poll<T>(
  trigger: OpenApiRequestBuilder<unknown>,
  options: PollOptions<T>
): AsyncGenerator<T, T | undefined, void> {
  const { destination, requestConfig, signal } = options;
  signal?.throwIfAborted();
  // One never-aborting fallback signal rather than allocating one per iteration.
  const abortSignal = signal ?? new AbortController().signal;
  const created = await trigger.executeRaw(destination, {
    ...requestConfig,
    signal
  });
  const read = createStatusReader(created, options);

  for (;;) {
    abortSignal.throwIfAborted();
    const resource = await read(abortSignal);
    if (resource === GONE) {
      return undefined;
    }
    if (checkTerminal(resource, options)) {
      return resource;
    }
    yield resource;
  }
}

/**
 * Runs an asynchronous operation and waits until it reaches a terminal state.
 *
 * Executes the `trigger` request once, then polls `statusRequest` with exponential backoff
 * and jitter, honoring a `Retry-After` header on transient errors. Returns the terminal
 * resource; throws a {@link PollFailedError} on a terminal failure and a
 * {@link PollTimeoutError} when the `timeoutMs` budget is exhausted. With
 * `notFound: 'resolve'` the result is `undefined` once the resource is gone.
 *
 * Note: the `notFound: 'resolve'` overload widens the result to `T | undefined`. Pass it as a
 * literal (`notFound: 'resolve'`); a value typed `'throw' | 'resolve'` selects the `Promise<T>`
 * overload and silently drops the `undefined`.
 * @template T - The status resource type.
 * @param trigger - The request builder for the asynchronous operation (returns `202`).
 * @param options - Polling and request configuration.
 * @returns The terminal resource (or `undefined` when a `404` completed a `notFound: 'resolve'` flow).
 * @throws PollFailedError on a terminal failure state.
 * @throws PollTimeoutError when the wall-clock budget is exhausted.
 */
export function waitUntilDone<T>(
  trigger: OpenApiRequestBuilder<unknown>,
  options: WaitOptions<T> & { notFound: 'resolve' }
): Promise<T | undefined>;
export function waitUntilDone<T>(
  trigger: OpenApiRequestBuilder<unknown>,
  options: WaitOptions<T>
): Promise<T>;
export async function waitUntilDone<T>(
  trigger: OpenApiRequestBuilder<unknown>,
  options: WaitOptions<T>
): Promise<T | undefined> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    backoff,
    maxConsecutiveErrors = DEFAULT_MAX_CONSECUTIVE_ERRORS,
    onPoll,
    destination,
    requestConfig,
    signal
  } = options;

  const started = Date.now();
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const pollSignal = signal
    ? AbortSignal.any([signal, timeoutSignal])
    : timeoutSignal;

  // AbortSignal.timeout surfaces budget exhaustion as a plain abort; translate that back to a
  // domain PollTimeoutError. A real HTTP error that lost the race to the deadline (it carries a
  // status) is passed through rather than masked, and a caller-initiated abort propagates as-is.
  const toPollError = (error: unknown): unknown =>
    timeoutSignal.aborted &&
    !signal?.aborted &&
    getHttpStatus(error) === undefined
      ? new PollTimeoutError(Date.now() - started)
      : error;

  try {
    pollSignal.throwIfAborted();
    const created = await trigger.executeRaw(destination, {
      ...requestConfig,
      signal: pollSignal
    });
    const read = createStatusReader(created, options);

    let pollCount = 0;
    for (;;) {
      pollSignal.throwIfAborted();
      const resource = await readResilient(
        read,
        pollSignal,
        backoff,
        maxConsecutiveErrors
      );
      if (resource === GONE) {
        return undefined;
      }
      onPoll?.(resource);
      if (checkTerminal(resource, options)) {
        return resource;
      }
      pollCount += 1;
      await sleep(nextInterval(backoff, pollCount), pollSignal);
    }
  } catch (error) {
    throw toPollError(error);
  }
}

// Reads the status once, retrying transient request errors with backoff / `Retry-After`.
async function readResilient<T>(
  read: (signal: AbortSignal) => Promise<T | typeof GONE>,
  signal: AbortSignal,
  backoff: Backoff | undefined,
  maxConsecutiveErrors: number
): Promise<T | typeof GONE> {
  let consecutiveErrors = 0;
  for (;;) {
    signal.throwIfAborted();
    try {
      return await read(signal);
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
}

// Computes the backoff wait for the given 1-based attempt. The max bound is applied after
// jitter so it is a true upper bound on the wait.
function nextInterval(backoff: Backoff | undefined, attempt: number): number {
  const base = backoff?.baseIntervalMs ?? DEFAULT_BASE_INTERVAL_MS;
  const factor = backoff?.factor ?? DEFAULT_FACTOR;
  const randomize = backoff?.randomize ?? true;
  const randomSource = backoff?.randomSource ?? Math.random;
  const raw = base * factor ** Math.max(attempt - 1, 0);
  const jittered = randomize ? raw * (1 + randomSource()) : raw;
  return Math.min(jittered, backoff?.maxIntervalMs ?? jittered);
}

// Sleeps for `ms` using the global timer (so tests can drive it with fake timers),
// rejecting if the signal aborts.
function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    const timer = setTimeout(
      () => {
        signal.removeEventListener('abort', onAbort);
        resolve();
      },
      Math.max(ms, 0)
    );
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

function classifyError(error: unknown): 'retryable' | 'fatal' {
  const status = getHttpStatus(error);
  if (status === 429 || status === 502 || status === 503 || status === 504) {
    return 'retryable';
  }
  const code = getErrorCode(error);
  if (code === 'ECONNRESET' || code === 'ETIMEDOUT' || code === 'EAI_AGAIN') {
    return 'retryable';
  }
  return 'fatal';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

// HTTP errors nest transport details differently per client layer: status and headers may
// sit on the error itself, on `.response`, or — once wrapped, e.g. SAP's ErrorWithCause —
// on `.cause` / `.cause.response`. Collect those layers once.
function errorLayers(error: unknown): Record<string, unknown>[] {
  if (!isRecord(error)) {
    return [];
  }
  const cause = isRecord(error.cause) ? error.cause : undefined;
  return [
    error,
    isRecord(error.response) ? error.response : undefined,
    cause,
    cause && isRecord(cause.response) ? cause.response : undefined
  ].filter((layer): layer is Record<string, unknown> => layer !== undefined);
}

function getHttpStatus(error: unknown): number | undefined {
  for (const layer of errorLayers(error)) {
    if (typeof layer.status === 'number') {
      return layer.status;
    }
  }
  return undefined;
}

function getErrorCode(error: unknown): string | undefined {
  for (const layer of errorLayers(error)) {
    if (typeof layer.code === 'string') {
      return layer.code;
    }
  }
  return undefined;
}

// Reads a `Retry-After` header (delta-seconds or HTTP-date) from a thrown error, in ms.
function retryAfterMs(error: unknown): number | undefined {
  let raw: unknown;
  for (const layer of errorLayers(error)) {
    if (isRecord(layer.headers)) {
      raw = layer.headers['retry-after'] ?? layer.headers['Retry-After'];
      if (raw !== undefined) {
        break;
      }
    }
  }
  if (typeof raw !== 'string' && typeof raw !== 'number') {
    return undefined;
  }
  const seconds = Number(raw);
  if (Number.isFinite(seconds)) {
    return Math.max(seconds, 0) * 1_000;
  }
  const dateMs = Date.parse(String(raw));
  return Number.isNaN(dateMs) ? undefined : Math.max(dateMs - Date.now(), 0);
}
