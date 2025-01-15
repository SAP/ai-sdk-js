/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'AzureOpenAiChatCompletionTokenLogprob' schema.
 */
export type AzureOpenAiChatCompletionTokenLogprob = {
  /**
   * The token.
   */
  token: string;
  /**
   * The log probability of this token.
   */
  logprob: number;
  /**
   * A list of integers representing the UTF-8 bytes representation of the token. Useful in instances where characters are represented by multiple tokens and their byte representations must be combined to generate the correct text representation. Can be `null` if there is no bytes representation for the token.
   */
  bytes: number[] | null;
  /**
   * List of the most likely tokens and their log probability, at this token position. In rare cases, there may be fewer than the number of requested `top_logprobs` returned.
   */
  top_logprobs: ({
    /**
     * The token.
     */
    token: string;
    /**
     * The log probability of this token.
     */
    logprob: number;
    /**
     * A list of integers representing the UTF-8 bytes representation of the token. Useful in instances where characters are represented by multiple tokens and their byte representations must be combined to generate the correct text representation. Can be `null` if there is no bytes representation for the token.
     */
    bytes: number[] | null;
  } & Record<string, any>)[];
} & Record<string, any>;
