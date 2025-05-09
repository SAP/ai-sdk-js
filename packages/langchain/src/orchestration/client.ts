import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { OrchestrationClient as OrchestrationClientBase } from '@sap-ai-sdk/orchestration';
import { ChatGenerationChunk } from '@langchain/core/outputs';
import { type BaseMessage } from '@langchain/core/messages';
import {
  _convertOrchestrationChunkToMessageChunk,
  isTemplate,
  mapLangchainMessagesToOrchestrationMessages,
  mapOutputToChatResult
} from './util.js';
import { OrchestrationMessageChunk } from './orchestration-message-chunk.js';
import type { BaseLanguageModelInput } from '@langchain/core/language_models/base';
import type { Runnable, RunnableLike } from '@langchain/core/runnables';
import type { ChatResult } from '@langchain/core/outputs';
import type { BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import type { ResourceGroupConfig } from '@sap-ai-sdk/ai-api';
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
        const messagesHistory =
          mapLangchainMessagesToOrchestrationMessages(messages);
        return orchestrationClient.chatCompletion(
          {
            messagesHistory,
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

  /**
   * Stream response chunks from the OrchestrationClient.
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

    let defaultRole: string | undefined;
    const messagesHistory =
      mapLangchainMessagesToOrchestrationMessages(messages);

    const { inputParams, customRequestConfig } = options;
    const mergedOrchestrationConfig = this.mergeOrchestrationConfig(options);

    const orchestrationClient = new OrchestrationClientBase(
      mergedOrchestrationConfig,
      this.deploymentConfig,
      this.destination
    );

    const streamOptions = {
      llm: {
        include_usage: true,
        ...options.streamOptions?.llm
      },
      outputFiltering: options.streamOptions?.outputFiltering,
      global: options.streamOptions?.global
    };

    const response = await this.caller.callWithOptions(
      { signal: options.signal },
      () =>
        orchestrationClient.stream(
          { messagesHistory, inputParams },
          controller,
          streamOptions,
          customRequestConfig
        )
    );

    for await (const chunk of response.stream) {
      if (!chunk.data) {
        continue;
      }

      const delta = chunk.getDelta();
      if (!delta) {
        continue;
      }
      const messageChunk = _convertOrchestrationChunkToMessageChunk(
        chunk.data,
        delta,
        defaultRole
      );

      defaultRole = delta.role ?? defaultRole;
      const finishReason = chunk.getFinishReason();
      const tokenUsage = chunk.getTokenUsage();

      // Add token usage to the message chunk if this is the final chunk
      if (finishReason && tokenUsage) {
        if (messageChunk instanceof OrchestrationMessageChunk) {
          messageChunk.response_metadata.finish_reason = finishReason;
          messageChunk.usage_metadata = {
            input_tokens: tokenUsage.prompt_tokens,
            output_tokens: tokenUsage.completion_tokens,
            total_tokens: tokenUsage.total_tokens
          };
        }
      }
      const content = delta.content ?? '';
      const generationChunk = new ChatGenerationChunk({
        message: messageChunk,
        text: content
      });

      // Notify the run manager about the new token
      await runManager?.handleLLMNewToken(
        content,
        {
          prompt: 0,
          completion: 0
        },
        undefined,
        undefined,
        undefined,
        { chunk: generationChunk }
      );

      // Yield the chunk
      yield generationChunk;
    }

    if (options.signal?.aborted) {
      throw new Error('AbortError');
    }
  }

  private mergeOrchestrationConfig(
    options: typeof this.ParsedCallOptions
  ): LangchainOrchestrationModuleConfig {
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
        ...(isTemplate(this.orchestrationConfig.templating) &&
          tools.length && {
            tools: [
              ...(this.orchestrationConfig.templating.tools || []),
              ...tools
            ]
          })
      }
    };
  }
}
