/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ToolChatMessageContent } from './tool-chat-message-content.js';
/**
 * Representation of the 'ToolChatMessage' schema.
 */
export type ToolChatMessage = {
  /**
   * @example "tool"
   */
  role: 'tool';
  tool_call_id: string;
  content: ToolChatMessageContent;
};
