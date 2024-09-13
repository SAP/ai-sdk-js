import type { BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import { BaseLLMParams } from '@langchain/core/language_models/llms';
import type {
  ChatOpenAICallOptions,
  OpenAIChatInput,
  OpenAIEmbeddingsParams
} from '@langchain/openai';
import type {
  OpenAiChatCompletionParameters,
  OpenAiChatModel,
  OpenAiEmbeddingModel
} from '@sap-ai-sdk/foundation-models';
import type { ConfigurationOptions } from '@sap-ai-sdk/ai-api';

/**
 * Input for Text generation for OpenAi GPT.
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
  ConfigurationOptions<OpenAiChatModel>;

/**
 * Chat Call options.
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
 * Input for Text generation for OpenAi GPT.
 */
export type OpenAiEmbeddingInput = Omit<
  OpenAIEmbeddingsParams,
  'modelName' | 'model' | 'azureOpenAIApiKey' | 'apiKey'
> &
  ConfigurationOptions<OpenAiEmbeddingModel> &
  BaseLLMParams;
