import { AzureOpenAiChatClient as AzureOpenAiChatClientBase } from '@sap-ai-sdk/foundation-models';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatGenerationChunk } from '@langchain/core/outputs';
import {
  mapAzureOpenAIChunkToLangChainMessageChunk,
  mapLangChainToAiClient,
  mapOutputToChatResult,
  mapToolToOpenAiTool
} from './util.js';
import type { NewTokenIndices } from '@langchain/core/callbacks/base';
import type { BaseLanguageModelInput } from '@langchain/core/language_models/base';
import type { AIMessageChunk, BaseMessage } from '@langchain/core/messages';
import type { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import type { ChatResult } from '@langchain/core/outputs';
import type {
  AzureOpenAiChatCallOptions,
  AzureOpenAiChatModelParams,
  ChatAzureOpenAIToolType
} from './types.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';
import type { Runnable } from '@langchain/core/runnables';

/**
 * LangChain chat client for Azure OpenAI consumption on SAP BTP.
 */
export class AzureOpenAiChatClient extends BaseChatModel<AzureOpenAiChatCallOptions> {
  temperature?: number | null;
  top_p?: number | null;
  logit_bias?: Record<string, any> | null | undefined;
  user?: string;
  presence_penalty?: number;
  frequency_penalty?: number;
  stop?: string | string[];
  max_tokens?: number;
  supportsStrictToolCalling?: boolean;
  private openAiChatClient: AzureOpenAiChatClientBase;

  constructor(
    fields: AzureOpenAiChatModelParams,
    destination?: HttpDestinationOrFetchOptions
  ) {
    super(fields);
    this.openAiChatClient = new AzureOpenAiChatClientBase(fields, destination);
    this.temperature = fields.temperature;
    this.top_p = fields.top_p;
    this.logit_bias = fields.logit_bias;
    this.user = fields.user;
    this.stop = fields.stop;
    this.presence_penalty = fields.presence_penalty;
    this.frequency_penalty = fields.frequency_penalty;
    this.max_tokens = fields.max_tokens;
    if (fields.supportsStrictToolCalling !== undefined) {
      this.supportsStrictToolCalling = fields.supportsStrictToolCalling;
    }
  }

  _llmType(): string {
    return 'azure_openai';
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
      () =>
        this.openAiChatClient.run(
          mapLangChainToAiClient(this, messages, options),
          options.requestConfig
        )
    );

    const content = res.getContent();

    // we currently do not support streaming
    await runManager?.handleLLMNewToken(
      typeof content === 'string' ? content : ''
    );

    return mapOutputToChatResult(res.data);
  }

  override bindTools(
    tools: ChatAzureOpenAIToolType[],
    kwargs?: Partial<AzureOpenAiChatCallOptions> | undefined
  ): Runnable<
    BaseLanguageModelInput,
    AIMessageChunk,
    AzureOpenAiChatCallOptions
  > {
    let strict: boolean | undefined;
    if (kwargs?.strict !== undefined) {
      strict = kwargs.strict;
    } else if (this.supportsStrictToolCalling !== undefined) {
      strict = this.supportsStrictToolCalling;
    }
    const newTools = tools.map(tool => mapToolToOpenAiTool(tool, strict));
    return this.withConfig({
      tools: newTools,
      ...kwargs
    } as Partial<AzureOpenAiChatCallOptions>);
  }

  /**
   * Stream response chunks from the Azure OpenAI client.
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
    const response = await this.caller.callWithOptions(
      {
        signal: options.signal
      },
      () => {
        const controller = new AbortController();
        if (options.signal) {
          options.signal.addEventListener('abort', () => controller.abort());
        }
        return this.openAiChatClient.stream(
          mapLangChainToAiClient(this, messages, options),
          controller,
          options.requestConfig
        );
      }
    );

    for await (const chunk of response.stream) {
      // There can be only none or one choice inside a chunk
      const choice = chunk.data.choices[0];

      // Map the chunk to a LangChain message chunk
      const messageChunk = mapAzureOpenAIChunkToLangChainMessageChunk(chunk);

      // Create initial generation info with token indices
      const newTokenIndices: NewTokenIndices = {
        prompt: options.promptIndex ?? 0,
        completion: choice?.index ?? 0
      };
      const generationInfo: Record<string, any> = { ...newTokenIndices };

      // Process finish reason
      if (choice?.finish_reason) {
        generationInfo.finish_reason = choice.finish_reason;
        // Only include system fingerprint in the last chunk for now to avoid concatenation issues
        generationInfo.system_fingerprint = chunk.data.system_fingerprint;
        generationInfo.model_name = chunk.data.model;
        generationInfo.id = chunk.data.id;
        generationInfo.created = chunk.data.created;
        generationInfo.index = choice.index;
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
}
