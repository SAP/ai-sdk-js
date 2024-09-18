import { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import { BaseMessage } from '@langchain/core/messages';
import type { ChatResult } from '@langchain/core/outputs';
import { AzureOpenAiChatClient as AzureOpenAiChatClientBase } from '@sap-ai-sdk/foundation-models';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { AzureOpenAiChatModel } from '@sap-ai-sdk/core';
import { mapLangchainToAiClient, mapResponseToChatResult } from './util.js';
import type { OpenAiChatCallOptions, OpenAiChatModelParams } from './types.js';

/**
 * OpenAI Language Model Wrapper to generate texts.
 */
export class AzureOpenAiChatClient
  extends BaseChatModel<OpenAiChatCallOptions>
  implements OpenAiChatModelParams
{
  modelName: AzureOpenAiChatModel;
  modelVersion?: string;
  resourceGroup?: string;
  temperature?: number;
  top_p?: number;
  logit_bias?: Record<string, unknown>;
  user?: string;
  n?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  stop?: string | string[];
  max_tokens?: number;
  private openAiChatClient: AzureOpenAiChatClientBase;

  constructor(fields: OpenAiChatModelParams) {
    super(fields);
    this.openAiChatClient = new AzureOpenAiChatClientBase(fields);
    this.modelName = fields.modelName;
    this.modelVersion = fields.modelVersion;
    this.resourceGroup = fields.resourceGroup;
    this.temperature = fields.temperature;
    this.top_p = fields.top_p;
    this.logit_bias = fields.logit_bias;
    this.user = fields.user;
    this.n = fields.n;
    this.stop = fields.stop;
    this.presence_penalty = fields.presence_penalty;
    this.frequency_penalty = fields.frequency_penalty;
    this.max_tokens = fields.max_tokens;
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
          mapLangchainToAiClient(this, options, messages),
          options.requestConfig
        )
    );

    // we currently do not support streaming
    await runManager?.handleLLMNewToken(
      typeof res.data.choices[0].message.content === 'string'
        ? res.data.choices[0].message.content
        : ''
    );

    return mapResponseToChatResult(res.data);
  }
}
