/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ChatDelta } from './chat-delta.js';
import type { ChoiceLogprobs } from './choice-logprobs.js';
/**
 * Representation of the 'LlmChoiceStreaming' schema.
 */
export type LlmChoiceStreaming = {
  /**
   * Index of the choice
   */
  index: number;
  delta: ChatDelta;
  logprobs?: ChoiceLogprobs;
  /**
   * Reason for stopping the model
   */
  finish_reason?: string;
} & Record<string, any>;
