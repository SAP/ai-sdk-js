/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiChatCompletionRequestMessageRole } from './chat-completion-request-message-role.js';
import type { AzureOpenAiChatCompletionRequestMessageContentPart } from './chat-completion-request-message-content-part.js';
/**
 * Representation of the 'AzureOpenAiChatCompletionRequestMessageUser' schema.
 */
export type AzureOpenAiChatCompletionRequestMessageUser = {
  role: AzureOpenAiChatCompletionRequestMessageRole;
} & {
  content: string | AzureOpenAiChatCompletionRequestMessageContentPart[] | null;
} & Record<string, any>;
