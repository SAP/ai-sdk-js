import { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import { BaseMessage } from '@langchain/core/messages';
import type { ChatResult } from '@langchain/core/outputs';
import { OpenAiChatClient as OpenAiChatClientBase } from '@sap-ai-sdk/foundation-models';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import {
  mapLangchainToAiClient,
  mapResponseToChatResult
} from './util.js';
import type { OpenAiChatModelInput, OpenAiChatCallOptions } from './types.js';

/**
 * OpenAI Language Model Wrapper to generate texts.
 */
export class AzureOpenAiChatClient extends BaseChatModel {
  declare CallOptions: OpenAiChatCallOptions;
  private openAiChatClient: OpenAiChatClientBase;
  constructor(fields: OpenAiChatModelInput) {
    super(fields);
    this.openAiChatClient = new OpenAiChatClientBase(fields);
  }

  _llmType(): string {
    return 'azure_openai';
  }

  override get callKeys(): (keyof OpenAiChatCallOptions)[] {
    return [...(super.callKeys as (keyof OpenAiChatCallOptions)[])];
  }

  override async _generate(
    messages: BaseMessage[],
    options: this['CallOptions'],
    runManager?: CallbackManagerForLLMRun
  ): Promise<ChatResult> {
    const res = await this.caller.callWithOptions(
      {
        signal: options.signal
      },
      () =>
        this.openAiChatClient.run(
          mapLangchainToAiClient(this, options, messages)
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
