/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Usage statistics for the completion request.
 */
export type AzureOpenAiCompletionUsage = {
  /**
   * Number of tokens in the prompt.
   */
  prompt_tokens: number;
  /**
   * Number of tokens in the generated completion.
   */
  completion_tokens: number;
  /**
   * Total number of tokens used in the request (prompt + completion).
   */
  total_tokens: number;
  /**
   * Breakdown of tokens used in a completion.
   */
  completion_tokens_details?: {
    /**
     * Tokens generated by the model for reasoning.
     */
    reasoning_tokens?: number;
  } & Record<string, any>;
} & Record<string, any>;
