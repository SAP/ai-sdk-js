import { PollFailedError } from './poll-failed-error.ts';
import { PollTimeoutError } from './poll-timeout-error.ts';
import {
  httpStatus,
  nextInterval,
  pollRetryMiddleware,
  sleep,
  validateBackoff
} from './retry.ts';

import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';
import type {
  CustomRequestConfig,
  HttpResponse
} from '@sap-cloud-sdk/http-client';

import type { OpenApiRequestBuilder } from '../openapi-request-builder.ts';
import type { Backoff } from './retry.ts';

export { PollFailedError, PollTimeoutError };
export type { Backoff } from './retry.ts';

const DEFAULT_TIMEOUT_MS = 60 * 60 * 1_000;

// A unique sentinel (never equal to a resource of type T) marking that a `notFound: 'resolve'`
// status read observed a 404 — i.e. the resource is gone.
const GONE = Symbol('gone');

/**
 * Terminal evaluation of a polled resource: still pending, successfully done, or a terminal
 * failure carrying a human-readable reason.
 */
export type PollStatus = 'pending' | 'done' | { failed: string };

/**
 * Options shared by {@link poll} and {@link waitUntilDone}.
 * @template T - The status resource type.
 */
export interface PollOptions<T> {
  /**
   * The request that reads the status, re-executed on each poll. Pass an
   * {@link OpenApiRequestBuilder} directly when the status id is known, or a factory that
   * derives it from the trigger's `202` response (e.g. an id from the `Location` header).
   */
  statusRequest:
    | OpenApiRequestBuilder<T>
    | ((created: HttpResponse) => OpenApiRequestBuilder<T>);
  /**
   * Evaluates the polled resource: `'pending'` to keep polling, `'done'` on success, or
   * `{ failed: reason }` to stop with a {@link PollFailedError}. Required — there is no
   * implicit completion, so a create/update flow cannot silently poll until timeout.
   */
  checkStatus: (resource: T) => PollStatus;
  /** When `'resolve'`, a `404` from the status read completes with `undefined` (the resource is gone). */
  notFound?: 'throw' | 'resolve';
  /** The destination to execute the requests against. */
  destination?: HttpDestinationOrFetchOptions;
  /** Custom request configuration forwarded to the trigger and the status requests. */
  requestConfig?: CustomRequestConfig;
  /** Signal that cancels polling and any in-flight request (composed with the timeout). */
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
  /**
   * Called after each poll that read a resource — including a terminal failure state, just
   * before {@link PollStatus} is evaluated (so a progress callback observes every state the
   * engine sees, not only successful ones).
   */
  onPoll?: (resource: T) => void;
}

// Composes the caller's requestConfig.signal with the engine's control signal so both can
// cancel, rather than overwriting the caller's signal.
function composeRequestConfig(
  requestConfig: CustomRequestConfig | undefined,
  controlSignal: AbortSignal
): CustomRequestConfig {
  const callerSignal = requestConfig?.signal;
  const signal = callerSignal
    ? AbortSignal.any([callerSignal, controlSignal])
    : controlSignal;
  return { ...requestConfig, signal };
}

// Resolves the status request (builder, or factory applied to the 202 response) once, then
// re-executes it per poll, mapping a resolved 404 to the GONE sentinel.
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
      return await builder.execute(
        destination,
        composeRequestConfig(requestConfig, signal)
      );
    } catch (error) {
      if (notFound === 'resolve' && httpStatus(error) === 404) {
        return GONE;
      }
      throw error;
    }
  };
}

/**
 * Polls an asynchronous operation as a pure state machine, without waiting between polls.
 *
 * The first `next()` runs the `trigger` request and performs the first status read; each
 * subsequent `next()` performs one more. Pending states are yielded, a terminal failure
 * throws a {@link PollFailedError}, and the terminal resource is returned when `checkStatus`
 * reports `'done'` (or `undefined` when a `404` completes a `notFound: 'resolve'` flow).
 *
 * This generator never sleeps and does not retry transient request errors — the caller drives
 * the cadence and error handling. Use {@link waitUntilDone} for the batteries-included case.
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
  const controller = new AbortController();
  const control = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;
  const created = await trigger.executeRaw(
    destination,
    composeRequestConfig(requestConfig, control)
  );
  const read = createStatusReader(created, options);

  try {
    for (;;) {
      control.throwIfAborted();
      const resource = await read(control);
      if (resource === GONE) {
        return undefined;
      }
      const status = options.checkStatus(resource);
      if (typeof status === 'object') {
        throw new PollFailedError(status.failed, resource);
      }
      if (status === 'done') {
        return resource;
      }
      yield resource;
    }
  } finally {
    controller.abort();
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
 * @template T - The status resource type.
 * @param trigger - The request builder for the asynchronous operation (returns `202`).
 * @param options - Polling and request configuration.
 * @returns The terminal resource.
 * @throws PollFailedError on a terminal failure state.
 * @throws PollTimeoutError when the wall-clock budget is exhausted.
 */
export function waitUntilDone<T>(
  trigger: OpenApiRequestBuilder<unknown>,
  options: WaitOptions<T> & { notFound?: 'throw' }
): Promise<T>;
export function waitUntilDone<T>(
  trigger: OpenApiRequestBuilder<unknown>,
  options: WaitOptions<T>
): Promise<T | undefined>;
export async function waitUntilDone<T>(
  trigger: OpenApiRequestBuilder<unknown>,
  options: WaitOptions<T>
): Promise<T | undefined> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    backoff,
    maxConsecutiveErrors,
    onPoll,
    destination,
    requestConfig,
    signal
  } = options;

  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new RangeError(
      `timeoutMs must be a positive, finite number, got ${timeoutMs}.`
    );
  }

  if (
    maxConsecutiveErrors !== undefined &&
    (!Number.isInteger(maxConsecutiveErrors) || maxConsecutiveErrors < 1)
  ) {
    throw new RangeError(
      `maxConsecutiveErrors must be a positive integer, got ${maxConsecutiveErrors}.`
    );
  }

  validateBackoff(backoff);

  const started = Date.now();
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const control = signal
    ? AbortSignal.any([signal, timeoutSignal])
    : timeoutSignal;

  // AbortSignal.timeout surfaces budget exhaustion as a plain abort; translate it to a domain
  // PollTimeoutError. A real HTTP error that lost the race (it has a status) is passed through.
  const toPollError = (error: unknown): unknown =>
    timeoutSignal.aborted && !signal?.aborted && httpStatus(error) === undefined
      ? new PollTimeoutError(Date.now() - started)
      : error;

  try {
    control.throwIfAborted();
    const created = await trigger.executeRaw(
      destination,
      composeRequestConfig(requestConfig, control)
    );

    // Retry transient status-read failures with a custom middleware instead of a hand-rolled
    // loop. Injected only here, so the pure `poll` generator stays retry-free (the caller owns
    // its retries); the trigger above runs once, unretried.
    const readConfig: CustomRequestConfig = {
      ...requestConfig,
      middleware: [
        ...(requestConfig?.middleware ?? []),
        pollRetryMiddleware({ backoff, maxConsecutiveErrors, signal: control })
      ]
    };
    const read = createStatusReader(created, {
      ...options,
      requestConfig: readConfig
    });

    let pollCount = 0;
    for (;;) {
      control.throwIfAborted();
      const resource = await read(control);
      if (resource === GONE) {
        return undefined;
      }
      onPoll?.(resource);
      const status = options.checkStatus(resource);
      if (typeof status === 'object') {
        throw new PollFailedError(status.failed, resource);
      }
      if (status === 'done') {
        return resource;
      }
      pollCount += 1;
      await sleep(nextInterval(backoff, pollCount), control);
    }
  } catch (error) {
    throw toPollError(error);
  }
}
