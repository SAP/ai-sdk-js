/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiChatCompletionRequestMessageContentPartType } from './chat-completion-request-message-content-part-type.js';
/**
 * Representation of the 'AzureOpenAiChatCompletionRequestMessageContentPartText' schema.
 */
export type AzureOpenAiChatCompletionRequestMessageContentPartText = {
  type: AzureOpenAiChatCompletionRequestMessageContentPartType;
} & {
  /**
   * The text content.
   */
  text: string;
} & Record<string, any>;
