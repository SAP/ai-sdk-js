import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { OrchestrationClient as OrchestrationClientBase } from '@sap-ai-sdk/orchestration';
import { mapLangchainMessagesToOrchestrationMessages, mapOutputToChatResult } from './util.js';
import type { OrchestrationModuleConfig } from '@sap-ai-sdk/orchestration';
import type { BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import type { ResourceGroupConfig } from '@sap-ai-sdk/ai-api';
import type { BaseMessage } from '@langchain/core/messages';
import type { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import type {
  OrchestrationCallOptions,
  OrchestrationResponse
} from './types.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

/**
 * LangChain chat client for Azure OpenAI consumption on SAP BTP.
 */
export class OrchestrationClient extends BaseChatModel<OrchestrationCallOptions> {
  // Omit streaming until supported
  orchestrationConfig: Omit<OrchestrationModuleConfig, 'streaming'>;
  langchainOptions?: BaseChatModelParams;
  deploymentConfig?: ResourceGroupConfig;
  destination?: HttpDestinationOrFetchOptions;

  // initialize with complete config and shit
  // allow to prompt + pass model params at invocatio
  // initialize a new client on every call, so that .bind() and .bindTools will properly work
  // shit is still cached because it's not instance specific
  constructor(
    // Omit streaming until supported
    orchestrationConfig: Omit<OrchestrationModuleConfig, 'streaming'>,
    langchainOptions: BaseChatModelParams = {},
    deploymentConfig?: ResourceGroupConfig,
    destination?: HttpDestinationOrFetchOptions,
  ) {
    super(langchainOptions);
    this.orchestrationConfig = orchestrationConfig;
    this.destination = destination;
    this.deploymentConfig = deploymentConfig;
  }

  _llmType(): string {
    return 'orchestration';
  }

  override async _generate(
    messages: BaseMessage[],
    // Ignoring all default options for now, could make sense to initalize a new caller based on the bound properties + options
    // that way the request options, e.g. maxRetries etc. will be applied.
    // some other options like tool_choice need to be put inside of the llm model_params and merged with existing configs
    // if we want to support those options
    // we can also make LLM params a call option
    // this would AFAIK align more with other langchain clients
    options: typeof this.ParsedCallOptions,
    runManager?: CallbackManagerForLLMRun
  ): Promise<OrchestrationResponse> {
    const res = await this.caller.callWithOptions(
      {
        signal: options.signal
      },
      () => {
        // Initializing a new client every time, as caching is unaffected
        // and we support the .bind() flow of langchain this way
        const orchestrationClient = new OrchestrationClientBase(this.orchestrationConfig, this.deploymentConfig, this.destination);
        return orchestrationClient.chatCompletion({
          // how to handle tools here? doesn't really exist as input in orchestration as message history
          // make template a call option, to merge it ??
          messagesHistory: mapLangchainMessagesToOrchestrationMessages(messages),
          inputParams: options.inputParams
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
