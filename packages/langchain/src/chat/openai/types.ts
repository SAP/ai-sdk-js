import { BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import { ChatOpenAICallOptions, OpenAIChatInput } from '@langchain/openai';
import {
  ConfigurationOptions,
  OpenAiChatCompletionParameters,
  OpenAiChatModel
} from '@sap-ai-sdk/gen-ai-hub';

/**
 * Input for Text generation for OpenAI GPT.
 */
export interface OpenAIChatModelInterface
  extends Omit<
      OpenAIChatInput,
      'openAIApiKey' | 'streaming'
    >,
    Omit<
      OpenAiChatCompletionParameters,
      'n' | 'stop' | 'messages' | 'temperature'
    >,
    BaseChatModelParams {}

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
