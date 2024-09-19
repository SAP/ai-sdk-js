/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiChatCompletionRequestMessageRole } from './chat-completion-request-message-role.js';
/**
 * Representation of the 'AzureOpenAiChatCompletionRequestMessageTool' schema.
 */
export type AzureOpenAiChatCompletionRequestMessageTool = {
  role: AzureOpenAiChatCompletionRequestMessageRole;
} & {
  /**
   * Tool call that this message is responding to.
   */
  tool_call_id: string;
  /**
   * The contents of the message.
   */
  content: string | null;
} & Record<string, any>;
