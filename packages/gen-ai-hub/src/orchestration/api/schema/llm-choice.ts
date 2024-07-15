/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ChatMessage } from './chat-message.js';
/**
 * Representation of the 'LLMChoice' schema.
 */
export type LLMChoice = {
  /**
   * Index of the choice.
   */
  index: number;
  message: ChatMessage;
  /**
   * Log probabilities.
   */
  logprobs?: Record<string, number[]>;
  /**
   * Reason for stopping the model.
   */
  finish_reason: string;
} & Record<string, any>;
