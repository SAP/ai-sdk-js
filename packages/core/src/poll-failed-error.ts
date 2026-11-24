/**
 * Thrown when the polled resource reaches a terminal failure state.
 */
export class PollFailedError extends Error {
  /** The terminal resource that reported the failure. */
  readonly resource: unknown;

  constructor(reason: string, resource: unknown) {
    super(reason);
    this.name = 'PollFailedError';
    this.resource = resource;
  }
}
