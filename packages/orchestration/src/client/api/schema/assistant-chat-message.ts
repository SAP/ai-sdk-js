/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AssistantChatMessageContentPart } from './assistant-chat-message-content-part.js';
import type { MessageToolCalls } from './message-tool-calls.js';
/**
 * Representation of the 'AssistantChatMessage' schema.
 */
export type AssistantChatMessage = {
  /**
   * @example "assistant"
   */
  role: 'assistant';
  content?: string | AssistantChatMessageContentPart[];
  refusal?: string;
  tool_calls?: MessageToolCalls;
};
