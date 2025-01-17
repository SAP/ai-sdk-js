/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiChatCompletionRequestUserMessageContentPart } from './chat-completion-request-user-message-content-part.js';
/**
 * Representation of the 'AzureOpenAiChatCompletionRequestUserMessage' schema.
 */
export type AzureOpenAiChatCompletionRequestUserMessage = {
  /**
   * The contents of the user message.
   *
   */
  content: string | AzureOpenAiChatCompletionRequestUserMessageContentPart[];
  /**
   * The role of the messages author, in this case `user`.
   */
  role: 'user';
  /**
   * An optional name for the participant. Provides the model information to differentiate between participants of the same role.
   */
  name?: string;
} & Record<string, any>;
