/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiChatCompletionResponseObject } from './chat-completion-response-object.js';
import type { AzureOpenAiCompletionUsage } from './completion-usage.js';
/**
 * Representation of the 'AzureOpenAiChatCompletionsResponseCommon' schema.
 */
export type AzureOpenAiChatCompletionsResponseCommon = {
  /**
   * A unique identifier for the chat completion.
   */
  id: string;
  object: AzureOpenAiChatCompletionResponseObject;
  /**
   * The Unix timestamp (in seconds) of when the chat completion was created.
   * Format: "unixtime".
   */
  created: number;
  /**
   * The model used for the chat completion.
   */
  model: string;
  usage?: AzureOpenAiCompletionUsage;
  /**
   * Can be used in conjunction with the `seed` request parameter to understand when backend changes have been made that might impact determinism.
   */
  system_fingerprint?: string;
} & Record<string, any>;
