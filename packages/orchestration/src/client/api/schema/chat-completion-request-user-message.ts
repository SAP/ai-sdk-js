/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ChatCompletionRequestUserMessageContentPart } from './chat-completion-request-user-message-content-part.js';
/**
 * Representation of the 'ChatCompletionRequestUserMessage' schema.
 */
export type ChatCompletionRequestUserMessage = {
  /**
   * @example "user"
   */
  role: 'user';
  content: string | ChatCompletionRequestUserMessageContentPart[];
};
