import { buildConfigRefPostRequest } from './completion-request-helpers.ts';

import type { OrchestrationResponse } from '../../orchestration-response.ts';
import type { OrchestrationStreamChunkResponse } from '../../orchestration-stream-chunk-response.ts';
import type { OrchestrationStreamResponse } from '../../orchestration-stream-response.ts';
import type {
  ChatCompletionRequest,
  OrchestrationConfigRefById,
  OrchestrationConfigRefByName,
  OrchestrationConfigRefModules,
  OrchestrationCreateRequestConfig
} from '../../orchestration-types.ts';
import type { CompletionApi } from '../orchestration-completion.ts';
import type {
  NewStreamOptionsWithFallbacks,
  NewStreamOptionsWithoutFallbacks
} from '../orchestration-streaming-types.ts';
import type {
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
 * Intermediate builder for a request backed by a stored configuration reference.
 * Carries the reference until `withModules` merges any module overrides and returns a builder whose `create` sends the request.
 * Obtain it from {@link CompletionApi.withConfigRef}.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class OrchestrationConfigRefBuilder {
  private configRef: OrchestrationConfigRefById | OrchestrationConfigRefByName;
  private client: CompletionApi;

  constructor(
    configRef: OrchestrationConfigRefById | OrchestrationConfigRefByName,
    client: CompletionApi
  ) {
    this.configRef = configRef;
    this.client = client;
  }

  /**
   * Merge module overrides on top of the stored configuration.
   * Returns a builder whose `create` takes the per-call prompt-templating pieces, the same as the other builders' `create`.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param modules - Partial module overrides (`filtering`, `masking`, `grounding`, `translation`) applied to the stored configuration at request time. Omit it to send the stored configuration unchanged.
   * @returns A builder whose `create` sends the request.
   */
  withModules(
    modules?: OrchestrationConfigRefModules
  ): OrchestrationConfigRefBuilder {
    const configRef = modules
      ? {
          ...this.configRef,
          overrideConfig: {
            ...this.configRef.overrideConfig,
            modules: {
              ...this.configRef.overrideConfig?.modules,
              ...modules
            }
          }
        }
      : this.configRef;
    return new OrchestrationConfigRefBuilder(configRef, this.client);
  }

  /**
   * Send a single request, supplying the prompt inline through `messages`.
   * The per-call pieces override the stored configuration: `model` becomes a `prompt_templating` override, and `messages` with the template options (`defaults`, `response_format`, `tools`) become the overriding `prompt_templating.prompt.template`, replacing the stored prompt. `messagesHistory` is sent as `messages_history`.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - Per-call inputs: optional `model`, `messages`, prompt options, `messagesHistory`, `placeholderValues`, and streaming options.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A stream response, because `stream` is set.
   */
  create(
    body: OrchestrationCompletionCreateOptionsWithMessages & StreamEnabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>>;
  /**
   * Send a single request, supplying the prompt inline through `messages`.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - Per-call inputs: optional `model`, `messages`, prompt options, `messagesHistory`, and `placeholderValues`.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A single response.
   */
  create(
    body: OrchestrationCompletionCreateOptionsWithMessages &
      StreamDisabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationResponse>;
  /**
   * Send a single request, referencing a remote prompt-registry template through `template_ref`.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - Per-call inputs: optional `model`, `template_ref`, `messagesHistory`, `placeholderValues`, and streaming options.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A stream response, because `stream` is set.
   */
  create(
    body: OrchestrationCompletionCreateOptionsWithTemplateRef &
      StreamEnabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>>;
  /**
   * Send a single request, referencing a remote prompt-registry template through `template_ref`.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - Per-call inputs: optional `model`, `template_ref`, `messagesHistory`, and `placeholderValues`.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A single response.
   */
  create(
    body: OrchestrationCompletionCreateOptionsWithTemplateRef &
      StreamDisabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationResponse>;
  /**
   * Send a request using the stored configuration unchanged.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - Per-call inputs: `messagesHistory`, `placeholderValues`, and streaming options.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A stream response when `stream` is set, otherwise a single response.
   */
  create(
    body?: {
      messagesHistory?: ChatCompletionRequest['messagesHistory'];
      placeholderValues?: ChatCompletionRequest['placeholderValues'];
      stream?:
        | boolean
        | NewStreamOptionsWithoutFallbacks
        | NewStreamOptionsWithFallbacks;
    },
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<
    | OrchestrationResponse
    | OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  >;
  create(
    body: Partial<OrchestrationCompletionCreateOptionsWithMessages> &
      Partial<OrchestrationCompletionCreateOptionsWithTemplateRef> & {
        messagesHistory?: ChatCompletionRequest['messagesHistory'];
        placeholderValues?: ChatCompletionRequest['placeholderValues'];
        stream?:
          | boolean
          | { enabled?: boolean }
          | NewStreamOptionsWithoutFallbacks
          | NewStreamOptionsWithFallbacks;
      } = {},
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<
    | OrchestrationResponse
    | OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  > {
    const postRequest = buildConfigRefPostRequest(
      this.configRef,
      body as OrchestrationCompletionCreateOptions & {
        messagesHistory?: ChatCompletionRequest['messagesHistory'];
        placeholderValues?: ChatCompletionRequest['placeholderValues'];
        stream?: unknown;
      }
    );
    return this.client.post(postRequest, requestConfig);
  }
}
