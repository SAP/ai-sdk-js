/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Breakdown of cache creation tokens by TTL (Anthropic only).
 */
export type CacheCreationTokenDetails = {
  /**
   * Tokens cached with 5-minute TTL.
   */
  ephemeral_5m_input_tokens?: number;
  /**
   * Tokens cached with 1-hour TTL.
   */
  ephemeral_1h_input_tokens?: number;
};
