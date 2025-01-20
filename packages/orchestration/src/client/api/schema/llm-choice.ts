/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ResponseChatMessage } from './response-chat-message.js';
/**
 * Representation of the 'LlmChoice' schema.
 */
export type LlmChoice = {
  /**
   * Index of the choice
   */
  index: number;
  message: ResponseChatMessage;
  /**
   * Log probabilities
   */
  logprobs?: Record<string, number[]>;
  /**
   * Reason the model stopped generating tokens. 'stop' if the model hit a natural stop point or a provided stop sequence, 'length' if the maximum token number was reached, 'content_filter' if content was omitted due to a filter enforced by the LLM model provider or the content filtering module
   * @example "stop"
   */
  finish_reason: string;
} & Record<string, any>;
