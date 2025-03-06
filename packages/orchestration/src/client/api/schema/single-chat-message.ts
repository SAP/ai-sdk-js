/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ChatCompletionRequestSystemMessage } from './chat-completion-request-system-message.js';
import type { ChatCompletionRequestUserMessage } from './chat-completion-request-user-message.js';
import type { ChatCompletionRequestAssistantMessage } from './chat-completion-request-assistant-message.js';
import type { ChatCompletionRequestToolMessage } from './chat-completion-request-tool-message.js';
/**
 * Representation of the 'SingleChatMessage' schema.
 */
export type SingleChatMessage =
  | ChatCompletionRequestSystemMessage
  | ChatCompletionRequestUserMessage
  | ChatCompletionRequestAssistantMessage
  | ChatCompletionRequestToolMessage;
