import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { OrchestrationClient as OrchestrationClientBase } from '@sap-ai-sdk/orchestration';
import { ChatGenerationChunk } from '@langchain/core/outputs';
import { type BaseMessage } from '@langchain/core/messages';
import {
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
    // Setup abort controller
    const controller = new AbortController();
    if (options.signal) {
      options.signal.addEventListener('abort', () => {
        controller.abort();
      });
    }

    try {
      // Extract options
      const { inputParams, customRequestConfig } = options;
      const mergedOrchestrationConfig = this.mergeOrchestrationConfig(options);

      // Create orchestration client
      const orchestrationClient = new OrchestrationClientBase(
        mergedOrchestrationConfig,
        this.deploymentConfig,
        this.destination
      );

      // Convert messages to orchestration format
      const messagesHistory =
        mapLangchainMessagesToOrchestrationMessages(messages);

      // Call the stream API
      const response = await this.caller.callWithOptions(
        { signal: options.signal },
        () =>
          orchestrationClient.stream(
            {
              messagesHistory,
              inputParams
            },
            controller,
            {
              llm: { include_usage: true }
            },
            customRequestConfig
          )
      );

      // Process the stream
      for await (const chunk of response.stream) {
        const deltaContent = chunk.getDeltaContent();
        if (!deltaContent) {
          continue;
        }

        await runManager?.handleLLMNewToken(deltaContent);

        // Create a message chunk
        const messageChunk = new OrchestrationMessageChunk(
          deltaContent,
          chunk.data.module_results || {},
          chunk.data.request_id || ''
        );

        // Yield a generation chunk
        yield new ChatGenerationChunk({
          message: messageChunk,
          text: deltaContent
        });
      }

      // After all chunks are processed, yield a final chunk with usage metadata
      // const tokenUsage = response.getTokenUsage();
      // const finishReason = response.getFinishReason();

      // if (tokenUsage) {
      //   // Create a message chunk with usage metadata
      //   const finalMessageChunk = new OrchestrationMessageChunk(
      //     '', // Empty content for the final chunk
      //     {}, // No module results for the final chunk
      //     '' // No request ID for the final chunk
      //   );

      //   // Add usage metadata
      //   finalMessageChunk.usage_metadata = {
      //     input_tokens: tokenUsage.completion_tokens,
      //     output_tokens: tokenUsage.prompt_tokens,
      //     total_tokens: tokenUsage.total_tokens
      //   };

      //   // Yield the final chunk with metadata
      //   yield new ChatGenerationChunk({
      //     message: finalMessageChunk,
      //     text: '',
      //     generationInfo: { finish_reason: finishReason }
      //   });
      // }
    } catch (e) {
      await runManager?.handleLLMError(e);
      throw e;
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
