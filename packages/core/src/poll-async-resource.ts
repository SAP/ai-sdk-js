import { setTimeout as delay } from 'timers/promises';

const DEFAULT_MAX_ATTEMPTS = 10;
const DEFAULT_INTERVAL_MS = 1_000;
const MAX_TIMER_DELAY_MS = 2_147_483_647;

/**
 * Options for polling an async resource until it reaches a terminal state.
 * @typeParam T - The resource type returned by the polling helper.
 * @typeParam ReadT - The value returned by the read function.
 */
export interface PollAsyncResourceOptions<T, ReadT = T> {
  /** Fetches the current state of the resource. */
  read: (signal?: AbortSignal) => Promise<ReadT>;
  /** Extracts the resource from the value returned by the read function. */
  getResource?: (response: ReadT) => T;
  /** Returns true when the resource has reached a successful terminal state. */
  isComplete: (resource: T) => boolean;
  /** Returns an error message string if the resource is in a failed state, undefined otherwise. */
  getFailure?: (resource: T) => string | undefined;
  /** Maximum number of poll attempts before throwing a timeout error. Defaults to 10. */
  maxAttempts?: number;
  /** Milliseconds to wait between poll attempts. Defaults to 1,000. */
  intervalMs?: number;
  /** Retry-After header value from the initial asynchronous response. */
  initialRetryAfter?: string;
  /** Returns the Retry-After header value from a polling response, if available. */
  getRetryAfter?: (response: ReadT) => string | undefined;
  /** Signal that cancels polling and waiting. */
  signal?: AbortSignal;
  /** Override the sleep function, e.g. for testing. */
  sleep?: (ms: number, signal?: AbortSignal) => Promise<void>;
}

/**
 * Polls an async resource until it completes, fails, or exceeds the attempt limit.
 * @typeParam T - The resource type returned by the polling helper.
 * @typeParam ReadT - The value returned by the read function.
 * @param options - Polling configuration.
 * @param options.read - Function to read the current state of the resource.
 * @param options.getResource - Optional function to extract the resource from the read response.
 * @param options.isComplete - Function to determine if the resource is in a completed state.
 * @param options.getFailure - Optional function to determine if the resource is in a failed state and return an error message.
 * @param options.maxAttempts - Maximum number of poll attempts before throwing a timeout error. Defaults to 10.
 * @param options.intervalMs - Milliseconds to wait between poll attempts. Defaults to 1,000.
 * @param options.initialRetryAfter - Retry-After header value from the initial asynchronous response.
 * @param options.getRetryAfter - Function to return the Retry-After header value from a polling response, if available.
 * @param options.signal - Signal that cancels polling and waiting.
 * @param options.sleep - Optional override for the sleep function, e.g. for testing.
 * @returns The resource in its completed state.
 * @throws Error if the resource enters a failure state or the attempt limit is exceeded.
 * @throws If the signal is aborted.
 */
export function pollAsyncResource<T>(
  options: PollAsyncResourceOptions<T, T> & { getResource?: undefined }
): Promise<T>;
export function pollAsyncResource<T, ReadT>(
  options: PollAsyncResourceOptions<T, ReadT> & {
    getResource: (response: ReadT) => T;
  }
): Promise<T>;
export async function pollAsyncResource<T, ReadT = T>({
  read,
  getResource,
  isComplete,
  getFailure,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
  intervalMs = DEFAULT_INTERVAL_MS,
  initialRetryAfter,
  getRetryAfter,
  signal,
  sleep = sleepWithSignal
}: PollAsyncResourceOptions<T, ReadT>): Promise<T> {
  const extractResource =
    getResource ?? ((response: ReadT): T => response as unknown as T);

  signal?.throwIfAborted();
  if (maxAttempts > 0 && initialRetryAfter !== undefined) {
    await sleep(parseRetryAfter(initialRetryAfter) ?? intervalMs, signal);
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    signal?.throwIfAborted();
    const response = await read(signal);
    signal?.throwIfAborted();
    const resource = extractResource(response);
    const failure = getFailure?.(resource);
    if (failure) {
      throw new Error(failure);
    }
    if (isComplete(resource)) {
      return resource;
    }
    if (attempt < maxAttempts) {
      const retryAfter = getRetryAfter?.(response);
      signal?.throwIfAborted();
      await sleep(parseRetryAfter(retryAfter) ?? intervalMs, signal);
    }
  }
  throw new Error(
    `Async resource did not complete after ${maxAttempts} attempts`
  );
}

async function sleepWithSignal(
  ms: number,
  signal?: AbortSignal
): Promise<void> {
  for (let remaining = ms; remaining > 0;) {
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

function parseRetryAfter(value: string | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmedValue = value.trim();
  if (/^\d+$/.test(trimmedValue)) {
    const seconds = Number(trimmedValue);
    const milliseconds = seconds * 1_000;
    return Number.isFinite(milliseconds) ? milliseconds : undefined;
  }

  if (
    !/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2} GMT$/.test(
      trimmedValue
    )
  ) {
    return undefined;
  }
  const timestamp = Date.parse(trimmedValue);
  if (Number.isNaN(timestamp)) {
    return undefined;
  }

  const date = new Date(timestamp);
  return date.toUTCString() === trimmedValue
    ? Math.max(timestamp - Date.now(), 0)
    : undefined;
}
