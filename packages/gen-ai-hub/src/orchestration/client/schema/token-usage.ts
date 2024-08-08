/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Usage of tokens in the response
 */
export type TokenUsage = {
  /**
   * Number of tokens used in the input
   */
  completion_tokens: number;
  /**
   * Number of tokens used in the output
   */
  prompt_tokens: number;
  /**
   * Total number of tokens used
   */
  total_tokens: number;
} & Record<string, any>;
