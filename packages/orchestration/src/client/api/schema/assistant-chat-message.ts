/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ChatMessageContent } from './chat-message-content.js';
import type { MessageToolCalls } from './message-tool-calls.js';
/**
 * Representation of the 'AssistantChatMessage' schema.
 */
export type AssistantChatMessage = {
  role: 'assistant';
  content?: ChatMessageContent;
  refusal?: string;
  tool_calls?: MessageToolCalls;
  /**
   * Reasoning or thinking content from the model's previous turn. Required when using extended thinking with tool calls for Anthropic Claude Models.
   *
   */
  reasoning_content?: string;
};
