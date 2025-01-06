/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ChatDelta } from './chat-delta.js';
/**
 * Representation of the 'LLMChoiceStreaming' schema.
 */
export type LLMChoiceStreaming = {
  /**
   * Index of the choice
   */
  index: number;
  delta: ChatDelta;
  /**
   * Log probabilities
   */
  logprobs?: Record<string, number[]>;
  /**
   * Reason for stopping the model
   */
  finish_reason?: string;
} & Record<string, any>;
