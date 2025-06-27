import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { OrchestrationClient as OrchestrationClientBase } from '@sap-ai-sdk/orchestration';
import { ChatGenerationChunk } from '@langchain/core/outputs';
import { type BaseMessage } from '@langchain/core/messages';
import {
  isTemplateRef,
  mapLangChainMessagesToOrchestrationMessages,
  mapOutputToChatResult,
  mapToolToChatCompletionTool,
  mapOrchestrationChunkToLangChainMessageChunk
} from './util.js';
import type { OrchestrationMessageChunk } from './orchestration-message-chunk.js';
import type { NewTokenIndices } from '@langchain/core/callbacks/base';
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
    if(options.stream) {
      const stream = this._streamResponseChunks(
        messages,
        options,
        runManager
      );
      const finalChunks: Record<number, ChatGenerationChunk> = {};

      for await (const chunk of stream) {
        chunk.message.response_metadata = {
          ...chunk.generationInfo,
          ...chunk.message.response_metadata,
        };
        const index =
          (chunk.generationInfo as NewTokenIndices)?.completion ?? 0;
        if (finalChunks[index] === undefined) {
          finalChunks[index] = chunk;
        } else {
          finalChunks[index] = finalChunks[index].concat(chunk);
        }
      }

      const generations = Object.entries(finalChunks)
        .sort(([aKey], [bKey]) => parseInt(aKey, 10) - parseInt(bKey, 10))
        .map(([_, value]) => value);

      return {
        generations
      };
    }

    const { inputParams, customRequestConfig } = options;
    const allMessages =
      mapLangChainMessagesToOrchestrationMessages(messages);
    const mergedOrchestrationConfig =
      this.mergeOrchestrationConfig(options);

    const res = await this.caller.callWithOptions(
    {
      signal: options.signal
    },
    () => {
      const controller = new AbortController();
      if (options.signal) {
        options.signal.addEventListener('abort', () => controller.abort());
      }

      const orchestrationClient = new OrchestrationClientBase(
        mergedOrchestrationConfig,
        this.deploymentConfig,
        this.destination
      );

      return orchestrationClient.chatCompletion(
        {
          messages: allMessages,
          inputParams
        },
        {
          ...customRequestConfig,
          signal: options.signal
        }
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
    return this.withConfig({
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
        signal: options.signal
      },
      () => {
        const controller = new AbortController();
        if (options.signal) {
          options.signal.addEventListener('abort', () => controller.abort());
        }
        return orchestrationClient.stream(
          { messages: orchestrationMessages, inputParams },
          controller,
          options.streamOptions,
          customRequestConfig
        );
      }
    );

    for await (const chunk of response.stream) {
      const orchestrationResult = chunk.data.orchestration_result;
      // There can be only none or one choice inside a chunk
      const choice = orchestrationResult?.choices[0];

      // Map the chunk to a LangChain message chunk
      const messageChunk = mapOrchestrationChunkToLangChainMessageChunk(chunk);

      // Create initial generation info with token indices
      const newTokenIndices: NewTokenIndices = {
        prompt: options.promptIndex ?? 0,
        completion: choice?.index ?? 0
      };
      const generationInfo: Record<string, any> = { ...newTokenIndices };

      // Process finish reason
      if (choice?.finish_reason && orchestrationResult) {
        generationInfo.finish_reason = choice.finish_reason;
        // Only include system fingerprint in the last chunk for now to avoid concatenation issues
        generationInfo.system_fingerprint =
          orchestrationResult.system_fingerprint;
        generationInfo.model_name = orchestrationResult.model;
        generationInfo.id = orchestrationResult.id;
        generationInfo.created = orchestrationResult.created;
        generationInfo.request_id = chunk.data.request_id;
      }

      // Process token usage
      const tokenUsage = chunk.getTokenUsage();
      if (tokenUsage) {
        generationInfo.token_usage = tokenUsage;
        messageChunk.usage_metadata = {
          input_tokens: tokenUsage.prompt_tokens,
          output_tokens: tokenUsage.completion_tokens,
          total_tokens: tokenUsage.total_tokens
        };
      }

      const content = chunk.getDeltaContent() ?? '';

      const generationChunk = new ChatGenerationChunk({
        message: messageChunk,
        text: content,
        generationInfo
      });

      // Notify the run manager about the new token
      // Some parameters(`_runId`, `_parentRunId`, `_tags`) are set as undefined as they are implicitly read from the context.
      await runManager?.handleLLMNewToken(
        content,
        newTokenIndices,
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
