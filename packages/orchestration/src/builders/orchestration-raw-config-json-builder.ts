import { constructCompletionPostRequestFromJsonModuleConfig } from '../util/index.ts';

import type { CompletionPostRequest } from '../client/api/schema/index.ts';
import type { OrchestrationResponse } from '../orchestration-response.ts';
import type { OrchestrationStreamChunkResponse } from '../orchestration-stream-chunk-response.ts';
import type { OrchestrationStreamResponse } from '../orchestration-stream-response.ts';
import type {
  ChatCompletionRequest,
  OrchestrationCreateOptions,
  OrchestrationCreateRequestConfig
} from '../orchestration-types.ts';
import type { Orchestration } from '../orchestration.ts';

/**
 * Builder for a request backed by a JSON string configuration (exported from AI Launchpad).
 * Its `create` omits `prompt`, because the configuration already specifies everything.
 * Obtain it from {@link Orchestration.rawConfigJson}.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class OrchestrationRawConfigJsonBuilder {
  private json: string;
  private client: Orchestration;

  constructor(json: string, client: Orchestration) {
    this.json = json;
    this.client = client;
  }

  /**
   * Send the request.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - Per-call inputs: `messagesHistory` and `placeholderValues`.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns The orchestration response, or a stream response when `stream` is `true`.
   */
  create(
    body: OrchestrationCreateOptions & { stream: true; streamOptions?: never },
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>>;
  create(
    body?: OrchestrationCreateOptions & {
      stream?: false;
      streamOptions?: never;
    },
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationResponse>;
  create(
    body?: OrchestrationCreateOptions,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<
    | OrchestrationResponse
    | OrchestrationStreamResponse<OrchestrationStreamChunkResponse>
  > {
    const request: ChatCompletionRequest = {
      messagesHistory: body?.messagesHistory,
      placeholderValues: body?.placeholderValues
    };
    const streamEnabled = body?.stream === true;
    const postRequest = constructCompletionPostRequestFromJsonModuleConfig(
      JSON.parse(this.json),
      request,
      streamEnabled
    );
    return this.client.post(
      postRequest as CompletionPostRequest,
      requestConfig
    );
  }
}
