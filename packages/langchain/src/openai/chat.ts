import { AzureOpenAiChatClient as AzureOpenAiChatClientBase } from '@sap-ai-sdk/foundation-models';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import {
  mapLangChainToAiClient,
  mapOutputToChatResult,
  mapToolToOpenAiTool
} from './util.js';
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
}
