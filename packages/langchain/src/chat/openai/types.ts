import { BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import { ChatOpenAICallOptions, OpenAIChatInput } from '@langchain/openai';
import {
  OpenAiChatCompletionParameters,
  OpenAiChatModel
} from '@sap-ai-sdk/gen-ai-hub';

/**
 * Input for Text generation for OpenAI GPT.
 */
export interface OpenAIChatModelInterface
  extends Omit<
      OpenAIChatInput,
      'openAIApiKey' | 'streaming' | 'model' | 'modelName'
    >,
    Omit<
      OpenAiChatCompletionParameters,
      'n' | 'stop' | 'messages' | 'temperature'
    >,
    BaseChatModelParams {
  /**
   * The name of the model.
   */
  modelName: OpenAiChatModel;
  /**
   * The name of the model. Alias for `modelName`.
   */
  model: OpenAiChatModel;
  /**
   * The version of the model.
   */
  modelVersion?: string;
}

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
  BaseChatModelParams & {
    /**
     * The name of the model.
     */
    modelName: OpenAiChatModel;
    /**
     * The version of the model.
     */
    modelVersion?: string;
  };

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
