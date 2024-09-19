/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiChatCompletionRequestMessageSystem } from './chat-completion-request-message-system.js';
import type { AzureOpenAiChatCompletionRequestMessageUser } from './chat-completion-request-message-user.js';
import type { AzureOpenAiChatCompletionRequestMessageAssistant } from './chat-completion-request-message-assistant.js';
import type { AzureOpenAiChatCompletionRequestMessageTool } from './chat-completion-request-message-tool.js';
import type { AzureOpenAiChatCompletionRequestMessageFunction } from './chat-completion-request-message-function.js';
/**
 * Representation of the 'AzureOpenAiChatCompletionRequestMessage' schema.
 */
export type AzureOpenAiChatCompletionRequestMessage =
  | ({ role: 'system' } & AzureOpenAiChatCompletionRequestMessageSystem)
  | ({ role: 'user' } & AzureOpenAiChatCompletionRequestMessageUser)
  | ({ role: 'assistant' } & AzureOpenAiChatCompletionRequestMessageAssistant)
  | ({ role: 'tool' } & AzureOpenAiChatCompletionRequestMessageTool)
  | ({ role: 'function' } & AzureOpenAiChatCompletionRequestMessageFunction);
