import { setTimeout as delay } from 'node:timers/promises';

const DEFAULT_MAX_WAIT_MS = 60 * 60 * 1_000;
const DEFAULT_INTERVAL_MS = 5_000;
const DEFAULT_MAX_CONSECUTIVE_ERRORS = 5;
const MAX_TIMER_DELAY_MS = 2_147_483_647;

/**
 * Outcome of a failed or partially-successful terminal poll.
 */
export interface PollFailure {
  /** 'failure' for a hard failure, 'partial' for a terminal state that completed with errors. */
  outcome: 'partial' | 'failure';
  /** Human-readable reason. */
  reason: string;
}

/**
 * Discriminated result of a completed poll.
 * @typeParam T - The polled resource type.
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
 * @typeParam T - The polled resource type.
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
  /** Returns a server-provided wait hint in milliseconds, read from a poll result or a thrown 429 error. */
  getRetryAfter?: (hint: unknown) => number | undefined;
  /** Classifies a thrown error as retryable (back off and continue) or fatal (propagate). */
  classifyError?: (error: unknown) => 'retryable' | 'fatal';
  /** Maximum number of consecutive retryable errors before the last error is propagated. Defaults to 5. */
  maxConsecutiveErrors?: number;
  /** Called after each successful poll with the current resource. */
  onPoll?: (resource: T) => void;
  /** Signal that cancels polling and waiting. */
  signal?: AbortSignal;
  /** Override the sleep function, e.g. for testing. */
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
 * @typeParam T - The polled resource type.
 * @param options - Polling configuration.
 * @returns An async generator yielding each polled resource and returning the terminal result.
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
  const abortSignal = signal ?? new AbortController().signal;
  const started = Date.now();
  const deadline = started + maxWaitTime;
  let pollCount = 0;
  let consecutiveErrors = 0;
  let lastResource: T | undefined;

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
}

/**
 * Polls a resource until it reaches a terminal state and returns the result.
 *
 * Convenience wrapper over {@link pollEach} for the common "wait until done" case.
 * @typeParam T - The polled resource type.
 * @param options - Polling configuration.
 * @returns The terminal {@link PollResult}.
 * @throws PollTimeoutError if the budget is exhausted.
 */
export async function pollUntilTerminal<T>(
  options: PollEngineOptions<T>
): Promise<PollResult<T>> {
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
  const jitter = backoff.jitter
    ? capped * backoff.jitter * Math.random()
    : 0;
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
  const clamped = Math.max(Math.min(requestedMs, remaining), 0);
  if (clamped > 0) {
    await sleep(clamped, signal);
  }
}

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

function getHttpStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }
  const record = error as Record<string, any>;
  return (
    record.status ??
    record.response?.status ??
    record.cause?.status ??
    record.cause?.response?.status
  );
}

function getErrorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }
  const record = error as Record<string, any>;
  return record.code ?? record.cause?.code;
}

async function sleepWithSignal(
  ms: number,
  signal?: AbortSignal
): Promise<void> {
  for (let remaining = ms; remaining; ) {
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
