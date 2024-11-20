/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiChatCompletionRequestToolMessageContentPart } from './chat-completion-request-tool-message-content-part.js';
/**
 * Representation of the 'AzureOpenAiChatCompletionRequestToolMessage' schema.
 */
export type AzureOpenAiChatCompletionRequestToolMessage = {
  /**
   * The role of the messages author, in this case `tool`.
   */
  role: 'tool';
  /**
   * The contents of the tool message.
   */
  content: string | AzureOpenAiChatCompletionRequestToolMessageContentPart[];
  /**
   * Tool call that this message is responding to.
   */
  tool_call_id: string;
} & Record<string, any>;
