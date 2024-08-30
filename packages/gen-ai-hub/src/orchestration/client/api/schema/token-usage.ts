/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Usage of tokens in the response.
 */
export type TokenUsage = {
  /**
   * Number of tokens used in the input.
   * @example 20
   */
  completion_tokens: number;
  /**
   * Number of tokens used in the output.
   * @example 30
   */
  prompt_tokens: number;
  /**
   * Total number of tokens used.
   * @example 50
   */
  total_tokens: number;
} & Record<string, any>;
