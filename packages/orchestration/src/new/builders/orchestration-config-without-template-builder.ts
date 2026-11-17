import { constructCompletionPostRequest } from '../util/index.ts';

import type { OrchestrationResponse } from '../orchestration-response.ts';
import type { OrchestrationStreamChunkResponse } from '../orchestration-stream-chunk-response.ts';
import type { OrchestrationStreamResponse } from '../orchestration-stream-response.ts';
import type {
  StreamOptionsWithoutOverrides,
  NewStreamOptionsWithFallbacks,
  NewStreamOptionsWithoutFallbacks
} from '../orchestration-streaming-types.ts';
import type {
  ChatCompletionRequest,
  OrchestrationConfigWithoutTemplate,
  OrchestrationCreateOptionsWithPrompt,
  OrchestrationCreateRequestConfig
} from '../orchestration-types.ts';
import type { CompletionApi } from '../orchestration-completion.ts';

/**
 * Builder for a request backed by an inline module configuration.
 * Its `create` accepts a per-call `prompt` — the current turn appended to the inline template.
 * Obtain it from {@link CompletionApi.config}.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class OrchestrationConfigWithoutTemplateBuilder {
  private config: OrchestrationConfigWithoutTemplate;
  private client: CompletionApi;

  constructor(
    config: OrchestrationConfigWithoutTemplate,
    client: CompletionApi
  ) {
    this.config = config;
    this.client = client;
  }

  /**
   * Send the request.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - Per-call inputs: `prompt`, `messagesHistory`, `placeholderValues`, and streaming options.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns The orchestration response, or a stream response when `stream` is `true`.
   */
  create(
    body: OrchestrationCreateOptionsWithPrompt & {
      stream:
        | true
        | { enabled: true }
        | (Omit<NewStreamOptionsWithoutFallbacks, 'enabled'> & {
            enabled?: true | undefined;
          })
        | (Omit<NewStreamOptionsWithFallbacks, 'enabled'> & {
            enabled?: true | undefined;
          });
    },
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>>;
  create(
    body?: OrchestrationCreateOptionsWithPrompt & {
      stream?: false | { enabled: false | undefined };
    },
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationResponse>;
  create(
    body?: OrchestrationCreateOptionsWithPrompt & {
      stream?:
        | boolean
        | NewStreamOptionsWithoutFallbacks
        | NewStreamOptionsWithFallbacks;
    },
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<
    | OrchestrationResponse
    | OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  > {
    const request: ChatCompletionRequest = {
      messages: body?.prompt,
      messagesHistory: body?.messagesHistory,
      placeholderValues: body?.placeholderValues
    };
    const streamEnabled = !!body?.stream;

    const postRequest = constructCompletionPostRequest(
      this.config,
      request,
      streamEnabled,
      body?.streamOptions as StreamOptionsWithoutOverrides | undefined
    );
    return this.client.post(postRequest, requestConfig);
  }
}
