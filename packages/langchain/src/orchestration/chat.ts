import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { OrchestrationClient as OrchestrationClientBase } from '@sap-ai-sdk/orchestration';
import { AsyncCaller } from '@langchain/core/utils/async_caller';
import { mapLangchainMessagesToOrchestrationMessages, mapOutputToChatResult } from './util.js';
import type { OrchestrationMessageChunk } from './orchestration-message-chunk.js';
import type { ChatResult } from '@langchain/core/outputs';
import type { OrchestrationModuleConfig } from '@sap-ai-sdk/orchestration';
import type { BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import type { ResourceGroupConfig } from '@sap-ai-sdk/ai-api';
import type { BaseMessage } from '@langchain/core/messages';
import type { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import type {
  OrchestrationCallOptions
} from './types.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

// TODO: Update all docs

/**
 * LangChain chat client for Azure OpenAI consumption on SAP BTP.
 */
export class OrchestrationClient extends BaseChatModel<OrchestrationCallOptions, OrchestrationMessageChunk> {
  constructor(
    // Omit streaming until supported
    public orchestrationConfig: Omit<OrchestrationModuleConfig, 'streaming'>,
    public langchainOptions: BaseChatModelParams = {},
    public deploymentConfig?: ResourceGroupConfig,
    public destination?: HttpDestinationOrFetchOptions,
  ) {
    super(langchainOptions);
  }

  _llmType(): string {
    return 'orchestration';
  }

  /**
   * Decisions:
   * bind only supports ParsedCallOptions, we don't support arbitrary LLM options, only tool calls & default BaseLanguageModelCallOptions, e.g. stop
   * this aligns with other vendors' client designs (e.g. openai, google)
   * top of the array (array[array.length - 1]) contains the current message, everything before then is history.
   * Module results are part of our own message type, which extends AI Message to work with all other langchain functionality.
   *
   * For timeout, we need to apply our own middleware, it is not handled by langchain.
   */

  override async _generate(
    messages: BaseMessage[],
    options: typeof this.ParsedCallOptions,
    runManager?: CallbackManagerForLLMRun
  ): Promise<ChatResult> {
    let caller = this.caller;
    if(options.maxConcurrency) {
      const { maxConcurrency, maxRetries, onFailedAttempt } = this.langchainOptions;
      caller = new AsyncCaller(
        { maxConcurrency: maxConcurrency ?? options.maxConcurrency,
          maxRetries,
          onFailedAttempt
        }
      );
    }
    const res = await caller.callWithOptions(
      {
        signal: options.signal
      },
      () => {
        // consider this.tools & this.stop property, merge it ith template orchestration config
        const orchestrationClient = new OrchestrationClientBase(this.orchestrationConfig, this.deploymentConfig, this.destination);
        const { messageHistory, inputParams } = mapLangchainMessagesToOrchestrationMessages(messages);
        return orchestrationClient.chatCompletion({
          // how to handle tools here? doesn't really exist as input in orchestration as message history
          // make template a call option, to merge it ??
          messagesHistory,
          inputParams
        }, options.customRequestConfig);
      }
    );

    const content = res.getContent();

    // we currently do not support streaming
    await runManager?.handleLLMNewToken(
      typeof content === 'string' ? content : ''
    );

    return mapOutputToChatResult(res.data);
  }
}

