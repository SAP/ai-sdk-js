/**
 * Thrown when the wall-clock budget is exhausted before the resource reaches a terminal state.
 */
export class PollTimeoutError extends Error {
  /** Milliseconds elapsed before giving up. */
  readonly elapsedMs: number;

  constructor(elapsedMs: number) {
    super(`Polling did not reach a terminal state within ${elapsedMs}ms`);
    this.name = 'PollTimeoutError';
    this.elapsedMs = elapsedMs;
  }
}
