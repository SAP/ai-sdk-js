/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ResponseMessageToolCalls } from './response-message-tool-calls.js';
/**
 * Representation of the 'ResponseChatMessage' schema.
 */
export type ResponseChatMessage = {
  /**
   * @example "assistant"
   */
  role?: 'assistant';
  content?: string;
  /**
   * @example "I'm sorry, I can't answer that question."
   */
  refusal?: string;
  tool_calls?: ResponseMessageToolCalls;
};
