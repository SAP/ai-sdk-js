import { isConfigReference } from '../../orchestration-types.ts';
import {
  constructCompletionPostRequest,
  constructCompletionPostRequestFromConfigReference
} from '../../util/index.ts';

import type { CompletionPostRequest } from '../../client/api/schema/index.ts';
import type { OrchestrationResponse } from '../../orchestration-response.ts';
import type { OrchestrationStreamChunkResponse } from '../../orchestration-stream-chunk-response.ts';
import type { OrchestrationStreamResponse } from '../../orchestration-stream-response.ts';
import type { StreamOptionsWithoutOverrides } from '../../orchestration-streaming-types.ts';
import type {
  NewStreamOptionsWithFallbacks,
  NewStreamOptionsWithoutFallbacks
} from '../orchestration-streaming-types.ts';
import type {
  ChatCompletionRequest,
  OrchestrationConfigWithTemplate,
  OrchestrationConfigRefById,
  OrchestrationConfigRefByName,
  OrchestrationModuleConfigList,
  OrchestrationCreateOptions,
  OrchestrationCreateRequestConfig
} from '../../orchestration-types.ts';
import type { CompletionApi } from '../orchestration-completion.ts';

/**
 * Configuration source for a request whose prompt is fixed, so its `create` omits `prompt`.
 * One of: a module configuration with a standing inline template or remote `TemplateRef`, a stored configuration reference, or a fallback list of module configurations.
 */
type ConfigWithTemplateSource =
  | OrchestrationConfigWithTemplate
  | OrchestrationConfigRefById
  | OrchestrationConfigRefByName
  | OrchestrationModuleConfigList;

/**
 * Builder for a request whose prompt is already fixed by its configuration source.
 * Handles a module configuration with a standing prompt (inline template or remote `TemplateRef`), a stored configuration reference, and a fallback list of module configurations.
 * Its `create` omits `prompt`, because none of these sources can be extended inline.
 * Obtain it from {@link CompletionApi.withModules} when passing a stored configuration reference.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class OrchestrationConfigWithTemplateBuilder {
  private config: ConfigWithTemplateSource;
  private client: CompletionApi;

  constructor(config: ConfigWithTemplateSource, client: CompletionApi) {
    this.config = config;
    this.client = client;
  }

  /**
   * Send the request.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - Per-call inputs: `messagesHistory`, `placeholderValues`, and streaming options.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns The orchestration response, or a stream response when `stream` is `true`.
   */
  create(
    body: OrchestrationCreateOptions & {
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
    body?: OrchestrationCreateOptions & {
      stream?: false | { enabled: false | undefined };
    },
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationResponse>;
  create(
    body?: OrchestrationCreateOptions & {
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
      messagesHistory: body?.messagesHistory,
      placeholderValues: body?.placeholderValues
    };
    const streamEnabled = !!body?.stream;

    let postRequest: CompletionPostRequest;
    if (isConfigReference(this.config)) {
      postRequest = constructCompletionPostRequestFromConfigReference(
        this.config,
        request,
        streamEnabled
      );
    } else if (Array.isArray(this.config)) {
      postRequest = constructCompletionPostRequest(
        this.config,
        request,
        streamEnabled,
        body?.streamOptions
      );
    } else {
      postRequest = constructCompletionPostRequest(
        this.config,
        request,
        streamEnabled,
        body?.streamOptions as StreamOptionsWithoutOverrides | undefined
      );
    }

    return this.client.post(postRequest, requestConfig);
  }
}
