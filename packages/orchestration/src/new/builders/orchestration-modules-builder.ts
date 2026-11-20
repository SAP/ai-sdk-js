import { buildSingleCompletionPostRequest } from './completion-request-helpers.ts';

import type { OrchestrationResponse } from '../../orchestration-response.ts';
import type { OrchestrationStreamChunkResponse } from '../../orchestration-stream-chunk-response.ts';
import type { OrchestrationStreamResponse } from '../../orchestration-stream-response.ts';
import type { OrchestrationCreateRequestConfig } from '../../orchestration-types.ts';
import type { CompletionApi } from '../orchestration-completion.ts';
import type {
  NewStreamOptionsWithFallbacks,
  NewStreamOptionsWithoutFallbacks
} from '../orchestration-streaming-types.ts';
import type {
  OrchestrationCompletionConfig,
  OrchestrationCompletionCreateOptions,
  OrchestrationCompletionCreateOptionsWithMessages,
  OrchestrationCompletionCreateOptionsWithTemplateRef
} from '../orchestration-types.ts';

/**
 * The `stream` field in its streaming form: `true`, `{ enabled: true }`, or a stream-options object.
 */
interface StreamEnabledField {
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
 */
interface StreamDisabledField {
  stream?: false | { enabled: false | undefined };
}

/**
 * Builder returned by `completion.withModules(config)` for a single non-prompt module configuration.
 * Its `create` supplies the prompt-templating pieces for one request: `model` (required), inline `messages` or a remote `template_ref`, plus `messagesHistory`, `placeholderValues`, and streaming options.
 * Unlike the callable `completion.create`, this builder accepts a single request only — not a fallback list.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class OrchestrationModulesBuilder {
  private config: OrchestrationCompletionConfig;
  private client: CompletionApi;

  constructor(config: OrchestrationCompletionConfig, client: CompletionApi) {
    this.config = config;
    this.client = client;
  }

  /**
   * Send the request, supplying the prompt inline through `messages`.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - Per-call inputs: `model` (required), `messages`, optional prompt options, `messagesHistory`, `placeholderValues`, and streaming options.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A stream response, because `stream` is set.
   */
  create(
    body: OrchestrationCompletionCreateOptionsWithMessages & StreamEnabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>>;
  /**
   * Send the request, supplying the prompt inline through `messages`.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - Per-call inputs: `model` (required), `messages`, optional prompt options, `messagesHistory`, and `placeholderValues`.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A single response.
   */
  create(
    body: OrchestrationCompletionCreateOptionsWithMessages &
      StreamDisabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationResponse>;
  /**
   * Send the request, referencing a remote prompt-registry template through `template_ref`.
   * `messages` is not accepted, because the template lives remotely and cannot be extended inline.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - Per-call inputs: `model` (required), `template_ref`, `messagesHistory`, `placeholderValues`, and streaming options.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A stream response, because `stream` is set.
   */
  create(
    body: OrchestrationCompletionCreateOptionsWithTemplateRef &
      StreamEnabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>>;
  /**
   * Send the request, referencing a remote prompt-registry template through `template_ref`.
   * `messages` is not accepted, because the template lives remotely and cannot be extended inline.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - Per-call inputs: `model` (required), `template_ref`, `messagesHistory`, and `placeholderValues`.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A single response.
   */
  create(
    body: OrchestrationCompletionCreateOptionsWithTemplateRef &
      StreamDisabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationResponse>;
  create(
    body: OrchestrationCompletionCreateOptions & {
      stream?:
        | boolean
        | { enabled?: boolean }
        | NewStreamOptionsWithoutFallbacks
        | NewStreamOptionsWithFallbacks;
    },
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<
    | OrchestrationResponse
    | OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  > {
    const postRequest = buildSingleCompletionPostRequest(this.config, body);
    return this.client.post(postRequest, requestConfig);
  }
}
