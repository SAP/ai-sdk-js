import { constructCompletionPostRequest } from '../util/index.ts';

import type { OrchestrationResponse } from '../orchestration-response.ts';
import type { OrchestrationStreamChunkResponse } from '../orchestration-stream-chunk-response.ts';
import type { OrchestrationStreamResponse } from '../orchestration-stream-response.ts';
import type {
  ChatCompletionRequest,
  BaseStreamOptions,
  StreamOptions,
  OrchestrationConfigWithoutTemplate,
  OrchestrationCreateOptionsWithPrompt,
  OrchestrationCreateRequestConfig
} from '../orchestration-types.ts';
import type { Orchestration } from '../orchestration.ts';

/**
 * Builder for a request backed by an inline module configuration.
 * Its `create` accepts a per-call `prompt` — the current turn appended to the inline template.
 * Obtain it from {@link Orchestration.config}.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class OrchestrationConfigWithoutTemplateBuilder {
  private config: OrchestrationConfigWithoutTemplate;
  private client: Orchestration;

  constructor(
    config: OrchestrationConfigWithoutTemplate,
    client: Orchestration
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
      stream: true;
      streamOptions?: StreamOptions;
    },
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>>;
  create(
    body?: OrchestrationCreateOptionsWithPrompt & {
      stream?: false;
      streamOptions?: never;
    },
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationResponse>;
  create(
    body?: OrchestrationCreateOptionsWithPrompt,
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
    if (body?.stream) {
      const streamBody = constructCompletionPostRequest(
        this.config,
        request,
        true,
        body.streamOptions as BaseStreamOptions | undefined
      );
      return this.client.post(streamBody, requestConfig);
    }
    return this.client.post(
      constructCompletionPostRequest(this.config, request, false),
      requestConfig
    );
  }
}
