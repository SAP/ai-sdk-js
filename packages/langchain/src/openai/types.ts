import type { BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import { BaseLLMParams } from '@langchain/core/language_models/llms';
import type {
  ChatOpenAICallOptions,
  OpenAIChatInput,
  OpenAIEmbeddingsParams
} from '@langchain/openai';
import type { OpenAiChatCompletionParameters } from '@sap-ai-sdk/foundation-models';
import type {
  AzureOpenAiChatModel,
  AzureOpenAiEmbeddingModel
} from '@sap-ai-sdk/core';
import type { ModelDeploymentConfig } from '@sap-ai-sdk/ai-api';

/**
 * Input type for OpenAI Chat models.
 */
export type OpenAiChatModelInput = Omit<
  OpenAIChatInput,
  | 'frequencyPenalty'
  | 'presencePenalty'
  | 'topP'
  | 'temperature'
  | 'stop'
  | 'n'
  | 'modelName'
  | 'model'
  | 'openAIApiKey'
  | 'streaming'
  | 'azureOpenAIApiKey'
  | 'openAIApiKey'
  | 'apiKey'
> &
  Omit<OpenAiChatCompletionParameters, 'messages'> &
  BaseChatModelParams &
  ModelDeploymentConfig<AzureOpenAiChatModel>;

/**
 * Chat model call options for OpenAI.
 */
export interface OpenAiChatCallOptions
  extends Omit<
      ChatOpenAICallOptions,
      | 'tool_choice'
      | 'promptIndex'
      | 'functions'
      | 'function_call'
      | 'tools'
      | 'response_format'
    >,
    Pick<
      OpenAiChatCompletionParameters,
      'tool_choice' | 'functions' | 'tools' | 'response_format'
    > {}

/**
 * Input type for OpenAI Embedding models.
 */
export type OpenAiEmbeddingInput = Omit<
  OpenAIEmbeddingsParams,
  'modelName' | 'model' | 'azureOpenAIApiKey' | 'apiKey'
> &
  ModelDeploymentConfig<AzureOpenAiEmbeddingModel> &
  BaseLLMParams;
