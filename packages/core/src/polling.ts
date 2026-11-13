import { setTimeout as delay } from 'node:timers/promises';

import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';
import type {
  CustomRequestConfig,
  HttpResponse
} from '@sap-cloud-sdk/http-client';

import type { OpenApiRequestBuilder } from './openapi-request-builder.ts';

const DEFAULT_MAX_WAIT_MS = 60 * 60 * 1_000;
const DEFAULT_INTERVAL_MS = 5_000;
const DEFAULT_MAX_CONSECUTIVE_ERRORS = 5;
const MIN_POLL_INTERVAL_MS = 1;
const MAX_TIMER_DELAY_MS = 2_147_483_647;

/**
 * A non-success terminal outcome. Despite the name this also covers `'partial'`
 * (a terminal state that completed with errors), not only hard failures.
 */
export interface PollFailure {
  /** 'failure' for a hard failure, 'partial' for a terminal state that completed with errors. */
  outcome: 'partial' | 'failure';
  /** Human-readable reason. */
  reason: string;
}

/**
 * Discriminated result of a completed poll.
 * @template T - The polled resource type.
 */
export type PollResult<T> =
  | { outcome: 'success'; resource: T }
  | { outcome: 'partial'; resource: T; reason: string }
  | { outcome: 'failure'; resource: T; reason: string };

/**
 * Backoff strategy for the wait between polls. Defaults to a fixed interval; exponential is opt-in.
 */
export interface Backoff {
  /** 'fixed' keeps a constant interval; 'exponential' doubles up to `maxIntervalMs`. Defaults to 'fixed'. */
  kind: 'fixed' | 'exponential';
  /** Random fraction (0..1) added to each exponential wait to avoid thundering herd. Only used when kind is 'exponential'. */
  jitter?: number;
  /** Upper bound for the exponential interval in milliseconds. */
  maxIntervalMs?: number;
}

/**
 * Options for the low-level polling engine.
 * @template T - The polled resource type.
 */
export interface PollEngineOptions<T> {
  /** Performs a single poll (e.g. a status GET). Throws on non-2xx responses. */
  read: (signal: AbortSignal) => Promise<T>;
  /** Returns true when the resource has reached a successful terminal state. */
  isComplete: (resource: T) => boolean;
  /** Returns a failure/partial outcome if the resource reached a failed or partial terminal state. */
  getFailure?: (resource: T) => PollFailure | undefined;
  /** Wall-clock budget in milliseconds before a {@link PollTimeoutError} is thrown. Defaults to one hour. */
  maxWaitTime?: number;
  /** Base interval between polls in milliseconds. Defaults to 5,000. */
  intervalMs?: number;
  /** Backoff strategy for the wait between polls. Defaults to a fixed interval. */
  backoff?: Backoff;
  /**
   * Returns a server-provided wait hint in milliseconds, read from a poll result or a
   * thrown 429 error. The engine stays transport-agnostic and defaults this to unset;
   * the HTTP wrappers ({@link createAndWait}/{@link deleteAndWait}) inject a
   * `Retry-After` header parser since header parsing is an HTTP-layer concern.
   */
  getRetryAfter?: (hint: unknown) => number | undefined;
  /** Classifies a thrown error as retryable (back off and continue) or fatal (propagate). */
  classifyError?: (error: unknown) => 'retryable' | 'fatal';
  /** Maximum number of consecutive retryable errors before the last error is propagated. Defaults to 5. */
  maxConsecutiveErrors?: number;
  /** Called after each successful poll with the current resource. */
  onPoll?: (resource: T) => void;
  /** Signal that cancels polling and waiting. */
  signal?: AbortSignal;
  /**
   * Override the sleep function. Test seam only.
   * @internal
   */
  sleep?: (ms: number, signal?: AbortSignal) => Promise<void>;
}

/**
 * Thrown when the wall-clock budget is exhausted before the resource reaches a terminal state.
 */
export class PollTimeoutError extends Error {
  /** Milliseconds elapsed before giving up. */
  readonly elapsedMs: number;
  /** The last resource observed before giving up, if any. */
  readonly lastResource?: unknown;

  constructor(elapsedMs: number, lastResource?: unknown) {
    super(`Polling did not reach a terminal state within ${elapsedMs}ms`);
    this.name = 'PollTimeoutError';
    this.elapsedMs = elapsedMs;
    this.lastResource = lastResource;
  }
}

/**
 * Polls a resource, yielding the resource after every poll until it reaches a terminal state.
 *
 * Yields each polled resource (including pending and partial states) so callers can observe
 * progress or stop early. Returns a {@link PollResult} once a terminal state is reached.
 * Honors a wall-clock budget (throwing {@link PollTimeoutError}), server retry hints on 429,
 * and a fixed or exponential backoff between polls.
 *
 * Note: the terminal {@link PollResult} is the generator's RETURN value, not a yielded value.
 * A plain `for await (const r of pollEach(...))` observes only the per-poll resources and
 * discards the result; capture it via the `.value` of the final `.next()` (see
 * {@link pollUntilTerminal}) or the `for await` loop's completion.
 * @template T - The polled resource type.
 * @param options - Polling configuration.
 * @returns An async generator yielding each polled resource and returning the terminal result.
 * @yields The resource observed on each poll.
 * @throws PollTimeoutError if the budget is exhausted.
 * @throws The original error on a fatal response or after too many consecutive retryable errors.
 */
export async function* pollEach<T>(
  options: PollEngineOptions<T>
): AsyncGenerator<T, PollResult<T>, void> {
  const {
    read,
    isComplete,
    getFailure,
    maxWaitTime = DEFAULT_MAX_WAIT_MS,
    intervalMs = DEFAULT_INTERVAL_MS,
    backoff = { kind: 'fixed' },
    getRetryAfter,
    classifyError = defaultClassifyError,
    maxConsecutiveErrors = DEFAULT_MAX_CONSECUTIVE_ERRORS,
    onPoll,
    signal,
    sleep = sleepWithSignal
  } = options;

  signal?.throwIfAborted();
  // The engine owns an AbortController linked to the caller's signal so an early
  // `break`/`return` from this generator cancels any in-flight read or sleep (B3 pull-model).
  const controller = new AbortController();
  const abortSignal = controller.signal;
  const forwardAbort = () => controller.abort(signal?.reason);
  signal?.addEventListener('abort', forwardAbort, { once: true });

  const started = Date.now();
  const deadline = started + maxWaitTime;
  let pollCount = 0;
  let consecutiveErrors = 0;
  let lastResource: T | undefined;

  try {
    for (;;) {
      abortSignal.throwIfAborted();
      if (Date.now() >= deadline) {
        throw new PollTimeoutError(Date.now() - started, lastResource);
      }

      let resource: T;
      try {
        resource = await read(abortSignal);
        consecutiveErrors = 0;
      } catch (error) {
        abortSignal.throwIfAborted();
        if (classifyError(error) === 'fatal') {
          throw error;
        }
        consecutiveErrors += 1;
        if (consecutiveErrors > maxConsecutiveErrors) {
          throw error;
        }
        const errorHint = getRetryAfter?.(error);
        await sleepUntilNextPoll(
          errorHint ?? intervalMs,
          deadline,
          sleep,
          abortSignal
        );
        continue;
      }

      lastResource = resource;
      pollCount += 1;
      onPoll?.(resource);
      yield resource;

      // getFailure is checked before isComplete on purpose: a terminal state can satisfy
      // both (e.g. a pipeline 'FINISHEDWITHERRORS' is "complete" AND a partial failure),
      // so failure/partial must win and never be reported as a plain success.
      const failure = getFailure?.(resource);
      if (failure) {
        return { outcome: failure.outcome, resource, reason: failure.reason };
      }
      if (isComplete(resource)) {
        return { outcome: 'success', resource };
      }

      const hint = getRetryAfter?.(resource);
      const waitMs = hint ?? nextInterval(intervalMs, backoff, pollCount);
      await sleepUntilNextPoll(waitMs, deadline, sleep, abortSignal);
    }
  } finally {
    signal?.removeEventListener('abort', forwardAbort);
    // Cancel any in-flight read/sleep if the consumer stopped early.
    controller.abort();
  }
}

/**
 * Polls a resource until it reaches a terminal state and returns the result.
 *
 * Convenience wrapper over {@link pollEach} for the common "wait until done" case.
 * @template T - The polled resource type.
 * @param options - Polling configuration.
 * @returns The terminal {@link PollResult}.
 * @throws PollTimeoutError if the budget is exhausted.
 */
export async function pollUntilTerminal<T>(
  options: PollEngineOptions<T>
): Promise<PollResult<T>> {
  // Drive the generator manually rather than `for await`: the terminal PollResult is the
  // generator's return value, which a `for await` loop would discard. We ignore each
  // yielded resource and keep pulling until `done`, then return the final `.value`.
  const iterator = pollEach(options);
  let next = await iterator.next();
  while (!next.done) {
    next = await iterator.next();
  }
  return next.value;
}

function nextInterval(
  intervalMs: number,
  backoff: Backoff,
  pollCount: number
): number {
  if (backoff.kind !== 'exponential') {
    return intervalMs;
  }
  const exponential = intervalMs * 2 ** Math.max(pollCount - 1, 0);
  const capped = Math.min(exponential, backoff.maxIntervalMs ?? exponential);
  const jitter = backoff.jitter ? capped * backoff.jitter * Math.random() : 0;
  return capped + jitter;
}

async function sleepUntilNextPoll(
  requestedMs: number,
  deadline: number,
  sleep: (ms: number, signal?: AbortSignal) => Promise<void>,
  signal?: AbortSignal
): Promise<void> {
  signal?.throwIfAborted();
  const remaining = deadline - Date.now();
  if (remaining <= 0) {
    return;
  }
  // ponytail: floor the wait so a zero/near-zero interval can't spin the loop without
  // the clock advancing. Raise MIN_POLL_INTERVAL_MS if tighter pacing is ever needed.
  const clamped = Math.min(
    Math.max(requestedMs, MIN_POLL_INTERVAL_MS),
    remaining
  );
  await sleep(clamped, signal);
}

// Only transient statuses are retried: 429 (rate limit) and 502/503/504 (gateway /
// availability) typically clear on their own. A bare 500 is treated as fatal — it is
// usually a deterministic server error that retrying will not resolve.
function defaultClassifyError(error: unknown): 'retryable' | 'fatal' {
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

function readNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined;
}

// HTTP errors nest transport details differently per client layer: the status and
// headers may sit on the error itself, on `.response`, or — once wrapped, e.g. SAP's
// ErrorWithCause — on `.cause` / `.cause.response`. Collect those layers once so the
// status/header lookups below share a single traversal.
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
    const status = readNumber(layer.status);
    if (status !== undefined) {
      return status;
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

/**
 * Extracts a server-provided wait hint, in milliseconds, from a thrown HTTP error's
 * `Retry-After` header (delta-seconds or an HTTP-date). Returns undefined for a
 * successfully-read poll resource or a value without the header.
 * @param hint - A thrown error or a successfully-read poll resource.
 * @returns The wait hint in milliseconds, or undefined when none is present.
 */
function retryAfterMsFromError(hint: unknown): number | undefined {
  let raw: unknown;
  for (const layer of errorLayers(hint)) {
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

async function sleepWithSignal(
  ms: number,
  signal?: AbortSignal
): Promise<void> {
  for (let remaining = ms; remaining;) {
    const currentDelay = Math.min(remaining, MAX_TIMER_DELAY_MS);
    try {
      await delay(currentDelay, undefined, { signal });
    } catch (error) {
      signal?.throwIfAborted();
      throw error;
    }
    remaining -= currentDelay;
  }
}

/**
 * Describes how to poll one asynchronous operation to completion.
 * @template StatusT - The status resource type returned by `statusRead`.
 */
export interface AsyncFlowDescriptor<StatusT> {
  /**
   * Builds the status-read request from the initial `202 Accepted` response.
   * The raw response is provided so the status URL can be taken from a `Location`
   * header or the response body when needed.
   */
  statusRead: (created: HttpResponse) => OpenApiRequestBuilder<StatusT>;
  /** Returns true when the status resource has reached a successful terminal state. */
  isComplete: (status: StatusT) => boolean;
  /** Returns a failure/partial outcome if the status resource reached a failed or partial terminal state. */
  getFailure?: (status: StatusT) => PollFailure | undefined;
}

/**
 * Options for {@link createAndWait}.
 */
export interface CreateAndWaitOptions {
  /** The destination to execute the requests against. */
  destination?: HttpDestinationOrFetchOptions;
  /** Custom request configuration forwarded to both the create and the status requests. */
  requestConfig?: CustomRequestConfig;
  /** Wall-clock budget in milliseconds before a {@link PollTimeoutError} is thrown. */
  maxWaitTime?: number;
  /** Base interval between polls in milliseconds. */
  intervalMs?: number;
  /** Backoff strategy for the wait between polls. Defaults to a fixed interval. */
  backoff?: Backoff;
  /** Signal that cancels polling and waiting. */
  signal?: AbortSignal;
  /** Called after each successful poll with the current status resource. */
  onPoll?: (status: unknown) => void;
}

/**
 * Options for {@link deleteAndWait}.
 */
export interface DeleteAndWaitOptions extends CreateAndWaitOptions {
  /**
   * When true, a `404` from the status read is treated as "deleted". Honored only when
   * this flag is set; the delete request itself must have returned 2xx first (a non-2xx
   * throws before polling). For a non-idempotent delete API that implies the resource
   * existed; an API that returns 2xx for an absent resource could report a false "deleted".
   */
  notFoundMeansDeleted?: boolean;
}

/**
 * Runs an asynchronous create (or trigger) operation and polls until it reaches a terminal state.
 *
 * Executes the `202 Accepted` request builder, then polls the status request described by
 * `descriptor` until completion. Standard {@link OpenApiRequestBuilder} ergonomics are preserved:
 * `destination` and `requestConfig` are forwarded to both requests.
 * @example
 * ```ts
 * const result = await createAndWait(
 *   SomeApi.createThing(body, headers),
 *   {
 *     statusRead: () => SomeApi.getThingStatus(id, headers),
 *     isComplete: status => status.state === 'ACTIVE',
 *     getFailure: status =>
 *       status.state === 'ERROR' ? { outcome: 'failure', reason: status.message } : undefined
 *   }
 * );
 * if (result.outcome === 'success') {
 *   // result.resource is the terminal status
 * }
 * ```
 * @template StatusT - The status resource type.
 * @param builder - The request builder for the asynchronous operation (returns `202`).
 * @param descriptor - How to read and interpret the status resource.
 * @param options - Polling and request configuration.
 * @returns The terminal {@link PollResult}.
 */
export async function createAndWait<StatusT>(
  builder: OpenApiRequestBuilder<unknown>,
  descriptor: AsyncFlowDescriptor<StatusT>,
  options: CreateAndWaitOptions = {}
): Promise<PollResult<StatusT>> {
  const { destination, requestConfig, signal, ...pollOptions } = options;
  signal?.throwIfAborted();
  const created = await builder.executeRaw(destination, {
    ...requestConfig,
    signal
  });
  return pollUntilTerminal<StatusT>({
    read: pollSignal =>
      descriptor
        .statusRead(created)
        .execute(destination, { ...requestConfig, signal: pollSignal }),
    isComplete: descriptor.isComplete,
    getFailure: descriptor.getFailure,
    getRetryAfter: retryAfterMsFromError,
    signal,
    ...pollOptions
  });
}

/**
 * Runs an asynchronous delete operation and polls until the resource is gone.
 *
 * Executes the delete request builder (which throws on a non-2xx response), then polls the
 * status request until it reports a terminal state or — when {@link DeleteAndWaitOptions.notFoundMeansDeleted}
 * is set — returns a `404`.
 * @template StatusT - The status resource type.
 * @param builder - The request builder for the delete operation (returns `202`).
 * @param descriptor - How to read and interpret the status resource.
 * @param options - Polling and request configuration.
 * @returns The terminal {@link PollResult}; the resource is `undefined` when a `404` ended polling.
 */
export async function deleteAndWait<StatusT>(
  builder: OpenApiRequestBuilder<unknown>,
  descriptor: AsyncFlowDescriptor<StatusT>,
  options: DeleteAndWaitOptions = {}
): Promise<PollResult<StatusT | undefined>> {
  const {
    destination,
    requestConfig,
    notFoundMeansDeleted,
    signal,
    ...pollOptions
  } = options;
  signal?.throwIfAborted();
  // The delete must return 2xx first (executeRaw throws on non-2xx). For a non-idempotent
  // delete API this means the resource existed; see DeleteAndWaitOptions.notFoundMeansDeleted.
  const deleted = await builder.executeRaw(destination, {
    ...requestConfig,
    signal
  });
  return pollUntilTerminal<StatusT | undefined>({
    // Sentinel contract: the status resource is `undefined` once the resource is gone
    // (a gated 404). The three callbacks below all treat `undefined` as "deleted" —
    // isComplete returns true, getFailure returns none, and the result resource is undefined.
    read: async pollSignal => {
      try {
        return await descriptor
          .statusRead(deleted)
          .execute(destination, { ...requestConfig, signal: pollSignal });
      } catch (error) {
        // A 404 ends polling only when opted in. Note: a single transient/misrouted
        // 404 is accepted as "deleted" without a retry budget — acceptable because the
        // delete returned 2xx first, but revisit if spurious 404s are observed.
        if (notFoundMeansDeleted && getHttpStatus(error) === 404) {
          return undefined;
        }
        throw error;
      }
    },
    isComplete: status => status === undefined || descriptor.isComplete(status),
    getFailure: status =>
      status === undefined ? undefined : descriptor.getFailure?.(status),
    getRetryAfter: retryAfterMsFromError,
    signal,
    ...pollOptions
  });
}
