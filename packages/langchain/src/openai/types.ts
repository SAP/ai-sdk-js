import type { BaseChatModelCallOptions, BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import { BaseLLMParams } from '@langchain/core/language_models/llms';
import type { OpenAiChatCompletionParameters } from '@sap-ai-sdk/foundation-models';
import type {
  AzureOpenAiChatModel,
  CustomRequestConfig
} from '@sap-ai-sdk/core';
import type { ModelConfiguration, ResourceGroupConfiguration } from '@sap-ai-sdk/ai-api';

/**
 * Input type for OpenAI chat models.
 */
export type OpenAiChatModelParams = Omit<OpenAiChatCompletionParameters, 'messages'> &
  BaseChatModelParams &
  ModelConfiguration<AzureOpenAiChatModel> &
  ResourceGroupConfiguration;

/**
 * Chat model call options for OpenAI.
 */
export type OpenAiChatCallOptions = CustomRequestConfig & BaseChatModelCallOptions;

/**
 * Input type for OpenAI embedding models.
 */
export type OpenAiEmbeddingModelParams = ModelConfiguration<AzureOpenAiChatModel> &
  ResourceGroupConfiguration &
  BaseLLMParams;

/**
 * OpenAI toolchoice type.
 */
export type ToolChoice =
  | 'none'
  | 'auto'
  | {
      /**
       * The type of the tool.
       */
      type: 'function';
      /**
       * Use to force the model to call a specific function.
       */
      function: {
        /**
         * The name of the function to call.
         */
        name: string;
      };
    };

/**
 * LangChain's toolchoice type.
 */
export type LangChainToolChoice = string | Record<string, any> | 'auto' | 'any';
