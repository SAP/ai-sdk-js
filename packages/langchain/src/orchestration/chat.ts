import { BaseChatModel, BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import { OrchestrationClient as OrchestrationClientBase, OrchestrationModuleConfig } from '@sap-ai-sdk/orchestration';
import { mapOutputToChatResult } from './util.js';
import type { ResourceGroupConfig } from '@sap-ai-sdk/ai-api';
import type { BaseMessage } from '@langchain/core/messages';
import type { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import type { ChatResult } from '@langchain/core/outputs';
import type {
  AzureOpenAiChatCallOptions,
} from './types.js';
import type { HttpDestinationOrFetchOptions } from '@sap-cloud-sdk/connectivity';

/**
 * LangChain chat client for Azure OpenAI consumption on SAP BTP.
 */
export class OrchestrationClient extends BaseChatModel<AzureOpenAiChatCallOptions> {
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
    this.orchestrationConfig = orchestrationConfig
    this.destination = destination
    this.deploymentConfig = deploymentConfig;
  }

  _llmType(): string {
    return 'orchestration';
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
        const orchestrationClient = new OrchestrationClientBase(this.orchestrationConfig, this.deploymentConfig, this.destination);
        return orchestrationClient.chatCompletion(
          mapLangchainToOrchestrationClient(this, messages, options),
      }
        const orchestrationClient = new OrchestrationClientBase(this.fields, this.deploymentConfig, this.destination);
        this.orchestrationClient.chatCompletion(
          mapLangchainToOrchestrationClient(this, messages, options),
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
}
