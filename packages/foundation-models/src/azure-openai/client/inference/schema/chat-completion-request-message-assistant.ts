/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiChatCompletionRequestMessage } from './chat-completion-request-message.js';
import type { AzureOpenAiChatCompletionMessageToolCall } from './chat-completion-message-tool-call.js';
import type { AzureOpenAiAzureChatExtensionsMessageContext } from './azure-chat-extensions-message-context.js';
/**
 * Representation of the 'AzureOpenAiChatCompletionRequestMessageAssistant' schema.
 */
export type AzureOpenAiChatCompletionRequestMessageAssistant =
  AzureOpenAiChatCompletionRequestMessage & {
    /**
     * The contents of the message.
     */
    content: string | null;
    /**
     * The tool calls generated by the model, such as function calls.
     */
    tool_calls?: AzureOpenAiChatCompletionMessageToolCall[];
    context?: AzureOpenAiAzureChatExtensionsMessageContext;
  } & Record<string, any>;
