/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'ChatCompletionTokenLogprob' schema.
 */
export type ChatCompletionTokenLogprob = {
  /**
   * The token.
   */
  token: string;
  /**
   * The log probability of this token.
   * Format: "float".
   */
  logprob: number;
  /**
   * A list of integers representing the UTF-8 bytes representation of the token. Useful in instances where characters are multi-byte.
   */
  bytes?: number[];
  /**
   * List of the most likely tokens and their log probability, at this token position. In rare cases, there may be fewer than the number of requested `top_logprobs`.
   */
  top_logprobs?: ({
    /**
     * The token.
     */
    token: string;
    /**
     * The log probability of this token.
     * Format: "float".
     */
    logprob: number;
    /**
     * A list of integers representing the UTF-8 bytes representation of the token. Useful in instances where characters are multi-byte.
     */
    bytes?: number[];
  } & Record<string, any>)[];
} & Record<string, any>;
