import { constructCompletionPostRequest } from '../../util/index.ts';
import { parseModuleConfigList } from '../../util/parse-config.ts';
import { normalizeModel } from './completion-request-helpers.ts';

import type { OrchestrationResponse } from '../../orchestration-response.ts';
import type { OrchestrationStreamChunkResponse } from '../../orchestration-stream-chunk-response.ts';
import type { OrchestrationStreamResponse } from '../../orchestration-stream-response.ts';
import type {
  ChatCompletionRequest,
  OrchestrationModuleConfig,
  OrchestrationModuleConfigList,
  OrchestrationCreateRequestConfig,
  PromptTemplatingModule
} from '../../orchestration-types.ts';
import type { CompletionApi } from '../orchestration-completion.ts';
import type {
  NewStreamOptionsWithFallbacks,
  NewStreamOptionsWithoutFallbacks
} from '../orchestration-streaming-types.ts';
import type {
  OrchestrationCompletionConfigList,
  OrchestrationCompletionCreateFallbacksOptions,
  OrchestrationInlinePromptOptions
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
    const {
      promptConfigs: fallbacks,
      messagesHistory,
      placeholderValues,
      stream
    } = body;

    if (fallbacks.length !== this.configs.length) {
      throw new Error(
        `Expected ${this.configs.length} fallback entr${this.configs.length === 1 ? 'y' : 'ies'} to match the configuration list, but received ${fallbacks.length}.`
      );
    }

    // Bake each entry's prompt into its own fallback config's
    // `promptTemplating`, so each fallback carries distinct messages. The
    // shared helper applies a single `request` across the whole list, so the
    // per-fallback prompt cannot travel through it — it is resolved here first.
    const list = fallbacks.map((entry, index) => {
      const { model, ...promptOptions } = entry;
      const { messages, ...prompt } =
        promptOptions as OrchestrationInlinePromptOptions & {
          messages?: ChatCompletionRequest['messages'];
        };
      return {
        ...this.configs[index],
        promptTemplating: {
          model: normalizeModel(model),
          prompt: {
            ...(messages && { template: messages }),
            ...prompt
          } as PromptTemplatingModule['prompt']
        }
      } as OrchestrationModuleConfig;
    }) as OrchestrationModuleConfigList;

    const request: ChatCompletionRequest = {
      messagesHistory,
      placeholderValues
    };
    const streamEnabled = !!stream;

    // TODO: map per-fallback stream options from the `stream` object into the
    // helper's `streamOptions` param. The `stream` field uses the new
    // `NewStreamOptions*` shape, while `constructCompletionPostRequest` still
    // expects the legacy `StreamOptions`. Left undefined until that translation
    // is settled (same gap as the other `new/` builders).
    const postRequest = constructCompletionPostRequest(
      parseModuleConfigList(list),
      request,
      streamEnabled,
      undefined
    );
    return this.client.post(postRequest, requestConfig);
  }
}
