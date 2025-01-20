/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiChatCompletionRequestAssistantMessageContentPart } from './chat-completion-request-assistant-message-content-part.js';
import type { AzureOpenAiChatCompletionMessageToolCalls } from './chat-completion-message-tool-calls.js';
/**
 * Representation of the 'AzureOpenAiChatCompletionRequestAssistantMessage' schema.
 */
export type AzureOpenAiChatCompletionRequestAssistantMessage = {
  /**
   * The contents of the assistant message. Required unless `tool_calls` or `function_call` is specified.
   *
   */
  content?:
    | string
    | AzureOpenAiChatCompletionRequestAssistantMessageContentPart[]
    | null;
  /**
   * The refusal message by the assistant.
   */
  refusal?: string | null;
  /**
   * The role of the messages author, in this case `assistant`.
   */
  role: 'assistant';
  /**
   * An optional name for the participant. Provides the model information to differentiate between participants of the same role.
   */
  name?: string;
  tool_calls?: AzureOpenAiChatCompletionMessageToolCalls;
  /**
   * Deprecated and replaced by `tool_calls`. The name and arguments of a function that should be called, as generated by the model.
   * @deprecated
   */
  function_call?:
    | ({
        /**
         * The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code before calling your function.
         */
        arguments: string;
        /**
         * The name of the function to call.
         */
        name: string;
      } & Record<string, any>)
    | null;
} & Record<string, any>;