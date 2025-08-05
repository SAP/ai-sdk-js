/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { LlmChoiceStreaming } from './llm-choice-streaming.js';
import type { TokenUsage } from './token-usage.js';
/**
 * Output of LLM module. Follows the OpenAI spec.
 */
export type LLMModuleResultStreaming = {
  /**
   * ID of the response
   */
  id: string;
  /**
   * Object type
   */
  object: string;
  /**
   * Unix timestamp
   */
  created: number;
  /**
   * Model name
   */
  model: string;
  /**
   * System fingerprint
   */
  system_fingerprint?: string;
  /**
   * Choices
   */
  choices: LlmChoiceStreaming[];
  usage?: TokenUsage;
} & Record<string, any>;
