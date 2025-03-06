/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MultiChatMessageContent } from './multi-chat-message-content.js';
import type { ResponseMessageToolCalls } from './response-message-tool-calls.js';
/**
 * Representation of the 'MultiChatMessage' schema.
 */
export type MultiChatMessage = {
  /**
   * @example "user"
   */
  role: string;
  content: MultiChatMessageContent[];
  tool_calls?: ResponseMessageToolCalls;
  refusal?: string | null;
  tool_call_id?: string | null;
};
