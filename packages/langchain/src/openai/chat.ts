import { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import { BaseMessage } from '@langchain/core/messages';
import type { ChatResult } from '@langchain/core/outputs';
import { AzureChatOpenAI, AzureOpenAI } from '@langchain/openai';
import { OpenAiChatClient as OpenAiChatClientBase } from '@sap-ai-sdk/foundation-models';
import { mapLangchainToAiClient, mapResponseToChatResult } from './util.js';
import type { OpenAIChatModelInput, OpenAIChatCallOptions } from './types.js';

/**
 * OpenAI Language Model Wrapper to generate texts.
 */
export class OpenAiChatClient extends AzureChatOpenAI {
  declare CallOptions: OpenAIChatCallOptions;
  private openAiChatClient: OpenAiChatClientBase;

  constructor(fields: OpenAIChatModelInput) {
    const defaultValues = new AzureOpenAI();
    const stop = fields.stop
      ? Array.isArray(fields.stop)
        ? fields.stop
        : [fields.stop]
      : defaultValues.stop;
    super({
      ...defaultValues,
      ...fields,
      stop,
      // overrides the apikey values as they are not applicable for BTP
      azureOpenAIApiKey: 'dummy',
      openAIApiKey: 'dummy',
      apiKey: 'dummy'
    });

    this.openAiChatClient = new OpenAiChatClientBase({ ...fields });
  }

  override get callKeys(): (keyof OpenAIChatCallOptions)[] {
    return [...(super.callKeys as (keyof OpenAIChatCallOptions)[])];
  }

  override get lc_secrets(): { [key: string]: string } | undefined {
    // overrides default keys as they are not applicable for BTP
    return {};
  }

  override get lc_aliases(): Record<string, string> {
    // overrides default keys as they are not applicable for BTP
    return {};
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
