import type {
  NewStreamOptionsWithFallbacks,
  NewStreamOptionsWithoutFallbacks
} from './types/streaming.ts';

/**
 * The `stream` field in its streaming form: `true`, `{ enabled: true }`, or a stream-options object.
 * @internal
 */
export interface StreamEnabledField {
  stream:
    | true
    | { enabled: true }
    | (Omit<NewStreamOptionsWithoutFallbacks, 'enabled'> & {
        enabled?: true | undefined;
      })
    | (Omit<NewStreamOptionsWithFallbacks, 'enabled'> & {
        enabled?: true | undefined;
      });
}

/**
 * The `stream` field in its non-streaming form: omitted, `false`, or `{ enabled: false }`.
 * @internal
 */
export interface StreamDisabledField {
  stream?: false | { enabled: false | undefined };
}
