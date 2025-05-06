/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { SystemChatMessage } from './system-chat-message.js';
import type { UserChatMessage } from './user-chat-message.js';
import type { AssistantChatMessage } from './assistant-chat-message.js';
import type { ToolChatMessage } from './tool-chat-message.js';
import type { DeveloperChatMessage } from './developer-chat-message.js';
/**
 * Representation of the 'ChatMessage' schema.
 */
export type ChatMessage =
  | SystemChatMessage
  | UserChatMessage
  | AssistantChatMessage
  | ToolChatMessage
  | DeveloperChatMessage;
