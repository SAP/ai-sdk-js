/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { OpenAiChatCompletionRequestMessage } from './chat-completion-request-message.js';
import type { OpenAiChatCompletionMessageToolCall } from './chat-completion-message-tool-call.js';
import type { OpenAiAzureChatExtensionsMessageContext } from './azure-chat-extensions-message-context.js';
/**
 * Representation of the 'OpenAiChatCompletionRequestMessageAssistant' schema.
 */
export type OpenAiChatCompletionRequestMessageAssistant =
  OpenAiChatCompletionRequestMessage & {
    /**
     * The contents of the message.
     */
    content: string;
    /**
     * The tool calls generated by the model, such as function calls.
     */
    tool_calls?: OpenAiChatCompletionMessageToolCall[];
    context?: OpenAiAzureChatExtensionsMessageContext;
  } & Record<string, any>;
