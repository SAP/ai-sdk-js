/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { SystemChatMessageContentPart } from './system-chat-message-content-part.js';
/**
 * Representation of the 'SystemChatMessage' schema.
 */
export type SystemChatMessage = {
  /**
   * @example "system"
   */
  role: 'system';
  content: string | SystemChatMessageContentPart[];
};
