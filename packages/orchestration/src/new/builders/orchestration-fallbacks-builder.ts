import { buildFallbackChainPostRequest } from './completion-request-helpers.ts';

import type { OrchestrationResponse } from '../../orchestration-response.ts';
import type { OrchestrationStreamChunkResponse } from '../../orchestration-stream-chunk-response.ts';
import type { OrchestrationStreamResponse } from '../../orchestration-stream-response.ts';
import type {
  StreamDisabledField,
  StreamEnabledField
} from '../completion-stream-types.ts';
import type { CompletionApi } from '../orchestration-completion.ts';
import type { OrchestrationCompletionCreateFallbacksOptions } from '../types/list-create-options.ts';
import type { OrchestrationCompletionConfigList } from '../types/orchestration-types.ts';
import type { OrchestrationCreateRequestConfig } from '../types/single-create-options.ts';
import type {
  NewStreamOptionsWithFallbacks,
  NewStreamOptionsWithoutFallbacks
} from '../types/streaming.ts';

/**
 * Builder returned by `completion.withModules(configList)` for a fallback list of prompt-less module configurations.
 * The orchestration service tries each configuration in order until one succeeds.
 * Its `create` takes per-fallback prompt inputs under `fallbacks`, positionally aligned to the configuration list, plus request-global options.
 * @experimental This class is experimental and may change at any time without prior notice.
 */
export class OrchestrationFallbacksBuilder {
  private configs: OrchestrationCompletionConfigList;
  private client: CompletionApi;

  constructor(
    configs: OrchestrationCompletionConfigList,
    client: CompletionApi
  ) {
    this.configs = configs;
    this.client = client;
  }

  /**
   * Send the fallback request, supplying each fallback's prompt-templating pieces positionally under `fallbacks`.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - `fallbacks` (per-fallback prompt inputs, one per configuration passed to `withModules`, in order), plus request-global `messagesHistory`, `placeholderValues`, and streaming options.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A stream response, because `stream` is set.
   */
  create(
    body: OrchestrationCompletionCreateFallbacksOptions & StreamEnabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationStreamResponse<OrchestrationStreamChunkResponse>>;
  /**
   * Send the fallback request, supplying each fallback's prompt-templating pieces positionally under `fallbacks`.
   * @experimental This method is experimental and may change at any time without prior notice.
   * @param body - `fallbacks` (per-fallback prompt inputs, one per configuration passed to `withModules`, in order), plus request-global `messagesHistory` and `placeholderValues`.
   * @param requestConfig - Transport configuration (`signal`, `headers`).
   * @returns A single response.
   */
  create(
    body: OrchestrationCompletionCreateFallbacksOptions & StreamDisabledField,
    requestConfig?: OrchestrationCreateRequestConfig
  ): Promise<OrchestrationResponse>;
  create(
    body: OrchestrationCompletionCreateFallbacksOptions & {
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
    const { promptConfigs: fallbacks } = body;

    if (fallbacks.length !== this.configs.length) {
      throw new Error(
        `Expected ${this.configs.length} fallback entr${this.configs.length === 1 ? 'y' : 'ies'} to match the configuration list, but received ${fallbacks.length}.`
      );
    }

    // Each fallback carries its own config from the list, positionally aligned
    // to the entries; the shared helper spreads `this.configs[index]` per entry.
    const postRequest = buildFallbackChainPostRequest(this.configs, body);
    return this.client.post(postRequest, requestConfig);
  }
}
