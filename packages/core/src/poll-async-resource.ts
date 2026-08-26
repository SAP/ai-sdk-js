import { setTimeout as delay } from 'timers/promises';

/**
 * Options for polling an async resource until it reaches a terminal state.
 * @typeParam T - The resource type returned by each poll.
 */
export interface PollAsyncResourceOptions<T> {
  /** Fetches the current state of the resource. */
  read: () => Promise<T>;
  /** Returns true when the resource has reached a successful terminal state. */
  isComplete: (resource: T) => boolean;
  /** Returns an error message string if the resource is in a failed state, undefined otherwise. */
  getFailure?: (resource: T) => string | undefined;
  /** Maximum number of poll attempts before throwing a timeout error. */
  maxAttempts: number;
  /** Milliseconds to wait between poll attempts. */
  intervalMs: number;
  /** Override the sleep function, e.g. for testing. */
  sleep?: (ms: number) => Promise<void>;
}

/**
 * Polls an async resource until it completes, fails, or exceeds the attempt limit.
 * @typeParam T - The resource type returned by each poll.
 * @param options - Polling configuration.
 * @param options.read - Function to read the current state of the resource.
 * @param options.isComplete - Function to determine if the resource is in a completed state.
 * @param options.getFailure - Optional function to determine if the resource is in a failed state and return an error message.
 * @param options.maxAttempts - Maximum number of poll attempts before throwing a timeout error.
 * @param options.intervalMs - Milliseconds to wait between poll attempts.
 * @param options.sleep - Optional override for the sleep function, e.g. for testing.
 * @returns The resource in its completed state.
 * @throws Error if the resource enters a failure state or the attempt limit is exceeded.
 */
export async function pollAsyncResource<T>({
  read,
  isComplete,
  getFailure,
  maxAttempts,
  intervalMs,
  sleep = delay
}: PollAsyncResourceOptions<T>): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const resource = await read();
    const failure = getFailure?.(resource);
    if (failure) {
      throw new Error(failure);
    }
    if (isComplete(resource)) {
      return resource;
    }
    if (attempt < maxAttempts) {
      await sleep(intervalMs);
    }
  }
  throw new Error(
    `Async resource did not complete after ${maxAttempts} attempts`
  );
}
