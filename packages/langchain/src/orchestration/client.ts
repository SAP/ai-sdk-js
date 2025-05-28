import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { OrchestrationClient as OrchestrationClientBase } from '@sap-ai-sdk/orchestration';
import { ChatGenerationChunk } from '@langchain/core/outputs';
import { type BaseMessage } from '@langchain/core/messages';
import {
  isTemplateRef,
  mapLangChainMessagesToOrchestrationMessages,
  mapOutputToChatResult,
  mapToolToChatCompletionTool,
  mapOrchestrationChunkToLangChainMessageChunk,
  setFinishReason,
  setTokenUsage,
  computeTokenIndices
} from './util.js';
import type { OrchestrationMessageChunk } from './orchestration-message-chunk.js';
import type { BaseLanguageModelInput } from '@langchain/core/language_models/base';
import type { Runnable, RunnableLike } from '@langchain/core/runnables';
import type { ChatResult } from '@langchain/core/outputs';
import type { BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import type { ResourceGroupConfig } from '@sap-ai-sdk/ai-api';
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
        const allMessages =
          mapLangChainMessagesToOrchestrationMessages(messages);
        return orchestrationClient.chatCompletion(
          {
            messages: allMessages,
            inputParams
          },
          customRequestConfig
        );
      }
    );

    const content = res.getContent();

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
    }
    return this.bind({
      tools: tools.map(tool => mapToolToChatCompletionTool(tool, strict)),
      ...kwargs
    } as Partial<OrchestrationCallOptions>);
  }

  /**
   * Stream response chunks from the Orchestration client.
   * @param messages - The messages to send to the model.
   * @param options - The call options.
   * @param runManager - The callback manager for the run.
   * @returns An async generator of chat generation chunks.
   */
  override async *_streamResponseChunks(
    messages: BaseMessage[],
    options: typeof this.ParsedCallOptions,
    runManager?: CallbackManagerForLLMRun
  ): AsyncGenerator<ChatGenerationChunk> {
    const controller = new AbortController();
    if (options.signal) {
      options.signal.addEventListener('abort', () => controller.abort());
    }

    const orchestrationMessages =
      mapLangChainMessagesToOrchestrationMessages(messages);

    const { inputParams, customRequestConfig } = options;
    const mergedOrchestrationConfig = this.mergeOrchestrationConfig(options);

    const orchestrationClient = new OrchestrationClientBase(
      mergedOrchestrationConfig,
      this.deploymentConfig,
      this.destination
    );

    const response = await this.caller.callWithOptions(
      {
        signal: controller.signal
      },
      () =>
        orchestrationClient.stream(
          { messages: orchestrationMessages, inputParams },
          controller,
          options.streamOptions,
          customRequestConfig
        )
    );

    for await (const chunk of response.stream) {
      const messageChunk = mapOrchestrationChunkToLangChainMessageChunk(chunk);
      const tokenIndices = computeTokenIndices(chunk);
      const finishReason = response.getFinishReason();
      const tokenUsage = response.getTokenUsage();

      setFinishReason(messageChunk, finishReason);
      setTokenUsage(messageChunk, tokenUsage);
      const content = chunk.getDeltaContent() ?? '';

      const generationChunk = new ChatGenerationChunk({
        message: messageChunk,
        text: content,
        generationInfo: { ...tokenIndices }
      });

      // Notify the run manager about the new token
      // Some parameters(`_runId`, `_parentRunId`, `_tags`) are set as undefined as they are implicitly read from the context.
      await runManager?.handleLLMNewToken(
        content,
        tokenIndices,
        undefined,
        undefined,
        undefined,
        { chunk: generationChunk }
      );

      yield generationChunk;
    }
  }

  private mergeOrchestrationConfig(
    options: typeof this.ParsedCallOptions
  ): LangChainOrchestrationModuleConfig {
    const { tools = [], stop = [] } = options;
    const config: LangChainOrchestrationModuleConfig = {
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
    if (tools.length) {
      if (!config.templating) {
        config.templating = {};
      }
      if (!isTemplateRef(config.templating)) {
        config.templating.tools = [
          // Preserve existing tools configured in the templating module
          ...(config.templating.tools || []),
          // Add new tools set with LangChain `bindTools()` or `invoke()` methods
          ...tools.map(t => mapToolToChatCompletionTool(t))
        ];
      }
    }
    return config;
  }
}
