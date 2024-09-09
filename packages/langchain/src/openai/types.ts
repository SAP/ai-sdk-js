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
  OpenAiEmbeddingModel,
  OpenAiEmbeddingParameters
} from '@sap-ai-sdk/foundation-models';
import type { ConfigurationOptions } from '@sap-ai-sdk/ai-api';

/**
 * Input for Text generation for OpenAI GPT.
 */
export type OpenAIChatModelInput = Omit<
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
> &
  Omit<OpenAiChatCompletionParameters, 'messages'> &
  BaseChatModelParams &
  ConfigurationOptions<OpenAiChatModel>;

/**
 * Chat Call options.
 */
export interface OpenAIChatCallOptions
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
 * Input for Text generation for OpenAI GPT.
 */
export type OpenAIEmbeddingInput = Omit<
  OpenAIEmbeddingsParams,
  'modelName' | 'model'
> &
  OpenAiEmbeddingParameters &
  ConfigurationOptions<OpenAiEmbeddingModel> &
  BaseLLMParams;
