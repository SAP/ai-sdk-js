import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { OrchestrationClient as OrchestrationClientBase } from '@sap-ai-sdk/orchestration';
import {
  isTemplate,
  mapLangChainMessagesToOrchestrationMessages,
  mapOutputToChatResult,
  mapToolToChatCompletionTool
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
  LangChainOrchestrationModuleConfig,
  ChatOrchestrationToolType
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
    public orchestrationConfig: LangChainOrchestrationModuleConfig,
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
          mapLangChainMessagesToOrchestrationMessages(messages);
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

  override bindTools(
    tools: ChatOrchestrationToolType[],
    kwargs?: Partial<OrchestrationCallOptions> | undefined
  ): Runnable<
    BaseLanguageModelInput,
    OrchestrationMessageChunk,
    OrchestrationCallOptions
  > {
    let strict: boolean | undefined;
    if (kwargs?.strict !== undefined) {
      strict = kwargs.strict;
    } // TODO: Check if we should add supportsStrictToolCalling here
    const newTools = tools.map(tool => mapToolToChatCompletionTool(tool, strict));
    return this.bind({
      tools: newTools,
      ...kwargs
    } as Partial<OrchestrationCallOptions>);
  }

  private mergeOrchestrationConfig(
    options: typeof this.ParsedCallOptions
  ): LangChainOrchestrationModuleConfig {
    const { tools = [], stop = [] } = options;
    return {
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
      },
      templating: {
        ...this.orchestrationConfig.templating,
        ...(this.orchestrationConfig.templating &&
          isTemplate(this.orchestrationConfig.templating) &&
          tools.length && {
          tools: [
            ...(this.orchestrationConfig.templating.tools || []),
            ...tools.map(t => mapToolToChatCompletionTool(t))
          ]
        })
      }
    };
  }
}
