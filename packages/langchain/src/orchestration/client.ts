import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { OrchestrationClient as OrchestrationClientBase } from '@sap-ai-sdk/orchestration';
import {
  isTemplate,
  mapLangchainMessagesToOrchestrationMessages,
  mapOutputToChatResult
} from './util.js';
import type { BaseLanguageModelInput } from '@langchain/core/language_models/base';
import type { Runnable, RunnableLike } from '@langchain/core/runnables';
import type { OrchestrationMessageChunk } from './orchestration-message-chunk.js';
import type { ChatResult } from '@langchain/core/outputs';
import type { BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import type { ResourceGroupConfig } from '@sap-ai-sdk/ai-api';
import type { BaseMessage } from '@langchain/core/messages';
import type { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import type {
  OrchestrationCallOptions,
  LangchainOrchestrationModuleConfig
} from './types.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

function isInputFilteringError(error: any): boolean {
  return (
    error.cause?.status === 400 &&
    error.cause?.response?.data?.location?.includes('Input Filter')
  );
}

/**
 * The Orchestration client.
 */
export class OrchestrationClient extends BaseChatModel<
  OrchestrationCallOptions,
  OrchestrationMessageChunk
> {
  constructor(
    // TODO: Omit streaming until supported
    public orchestrationConfig: LangchainOrchestrationModuleConfig,
    public langchainOptions: BaseChatModelParams = {},
    public deploymentConfig?: ResourceGroupConfig,
    public destination?: HttpDestinationOrFetchOptions
  ) {
    // Avoid retry if the error is due to input filtering
    const { onFailedAttempt } = langchainOptions;
    langchainOptions.onFailedAttempt = error => {
      if (isInputFilteringError(error)) {
        throw error;
      }
      onFailedAttempt?.(error);
    };

    super(langchainOptions);
  }

  _llmType(): string {
    return 'orchestration';
  }

  /**
   * Create a new runnable sequence that runs each individual runnable in series,
   * piping the output of one runnable into another runnable or runnable-like.
   * @param coerceable - A runnable, function, or object whose values are functions or runnables.
   * @returns A new runnable sequence.
   */
  override pipe<NewRunOutput>(
    coerceable: RunnableLike<OrchestrationMessageChunk, NewRunOutput>
  ): Runnable<
    BaseLanguageModelInput,
    Exclude<NewRunOutput, Error>,
    OrchestrationCallOptions
  > {
    return super.pipe(coerceable) as Runnable<
      BaseLanguageModelInput,
      Exclude<NewRunOutput, Error>,
      OrchestrationCallOptions
    >;
  }

  override async _generate(
    messages: BaseMessage[],
    options: typeof this.ParsedCallOptions,
    runManager?: CallbackManagerForLLMRun
  ): Promise<ChatResult> {
    const res = await this.caller.callWithOptions(
      {
        signal: options.signal
      },
      () => {
        const { inputParams, customRequestConfig } = options;
        const mergedOrchestrationConfig =
          this.mergeOrchestrationConfig(options);
        const orchestrationClient = new OrchestrationClientBase(
          mergedOrchestrationConfig,
          this.deploymentConfig,
          this.destination
        );
        const allMesages =
          mapLangchainMessagesToOrchestrationMessages(messages);
        return orchestrationClient.chatCompletion(
          {
            messages: allMesages,
            inputParams
          },
          customRequestConfig
        );
      }
    );

    const content = res.getContent();

    // TODO: Add streaming as soon as we support it
    await runManager?.handleLLMNewToken(
      typeof content === 'string' ? content : ''
    );

    return mapOutputToChatResult(res.data);
  }

  private mergeOrchestrationConfig(
    options: typeof this.ParsedCallOptions
  ): LangchainOrchestrationModuleConfig {
    const { tools = [], stop = [] } = options;
    const config: LangchainOrchestrationModuleConfig = {
      ...this.orchestrationConfig,
      llm: {
        ...this.orchestrationConfig.llm,
        model_params: {
          ...this.orchestrationConfig.llm.model_params,
          ...(stop.length && {
            stop: [
              ...(this.orchestrationConfig.llm.model_params?.stop || []),
              ...stop
            ]
          })
        }
      }
    };
    config.templating = this.orchestrationConfig.templating;
    if (config.templating && isTemplate(config.templating) && tools.length) {
      config.templating.tools = [...(config.templating.tools || []), ...tools];
    }
    return config;
  }
}
