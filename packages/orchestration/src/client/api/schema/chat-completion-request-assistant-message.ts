/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ChatCompletionRequestAssistantMessageContentPart } from './chat-completion-request-assistant-message-content-part.js';
import type { ResponseMessageToolCalls } from './response-message-tool-calls.js';
/**
 * Representation of the 'ChatCompletionRequestAssistantMessage' schema.
 */
export type ChatCompletionRequestAssistantMessage = {
  /**
   * @example "assistant"
   */
  role: 'assistant';
  content?: string | ChatCompletionRequestAssistantMessageContentPart[];
  refusal?: string;
  tool_calls?: ResponseMessageToolCalls;
};
