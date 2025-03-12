/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { UserChatMessageContentPart } from './user-chat-message-content-part.js';
/**
 * Messages sent by an end user, containing prompts or additional context
 * information.
 *
 */
export type UserChatMessage = {
  /**
   * The contents of the user message.``
   *
   */
  content: string | UserChatMessageContentPart[];
  /**
   * An optional name for the participant. Provides the model information to differentiate between participants of the same role.
   */
  role: 'user';
} & Record<string, any>;
