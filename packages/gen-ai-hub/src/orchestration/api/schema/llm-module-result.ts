/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { LLMChoice } from './llm-choice.js';
import type { TokenUsage } from './token-usage.js';
/**
 * Output of LLM module. Follows the OpenAI spec.
 */
export type LLMModuleResult = {
  /**
   * ID of the response.
   */
  id: string;
  /**
   * Object type.
   */
  object: string;
  /**
   * Unix timestamp.
   */
  created: number;
  /**
   * Model name.
   */
  model: string;
  /**
   * System fingerprint.
   */
  system_fingerprint?: string;
  /**
   * Choices.
   */
  choices: LLMChoice[];
  usage: TokenUsage;
} & Record<string, any>;
