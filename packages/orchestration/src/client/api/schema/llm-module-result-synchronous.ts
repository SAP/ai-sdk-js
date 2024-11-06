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
export type LLMModuleResultSynchronous = {
  /**
   * ID of the response
   * @example "chatcmpl-9rO0aLoPKY7RtqkWi1317bazHEVFr"
   */
  id: string;
  /**
   * Object type
   * @example "chat.completion"
   */
  object: string;
  /**
   * Unix timestamp
   * @example 1722510700
   */
  created: number;
  /**
   * Model name
   * @example "gpt-4"
   */
  model: string;
  /**
   * System fingerprint
   * @example "fp_44709d6fcb"
   */
  system_fingerprint?: string;
  /**
   * Choices
   */
  choices: LLMChoice[];
  usage: TokenUsage;
} & Record<string, any>;
