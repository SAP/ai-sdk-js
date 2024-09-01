/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { OpenAiChatCompletionResponseMessageRole } from './chat-completion-response-message-role.js';
import type { OpenAiChatCompletionMessageToolCall } from './chat-completion-message-tool-call.js';
import type { OpenAiChatCompletionFunctionCall } from './chat-completion-function-call.js';
import type { OpenAiAzureChatExtensionsMessageContext } from './azure-chat-extensions-message-context.js';
/**
 * A chat completion message generated by the model.
 */
export type OpenAiChatCompletionResponseMessage = {
  role?: OpenAiChatCompletionResponseMessageRole;
  /**
   * The contents of the message.
   */
  content?: string;
  /**
   * The tool calls generated by the model, such as function calls.
   */
  tool_calls?: OpenAiChatCompletionMessageToolCall[];
  function_call?: OpenAiChatCompletionFunctionCall;
  context?: OpenAiAzureChatExtensionsMessageContext;
} & Record<string, any>;
