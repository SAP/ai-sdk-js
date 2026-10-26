/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Cache control directive for prompt caching. When set on a content block, marks it as a cache breakpoint. Supported on Anthropic Claude models and Azure OpenAI GPT-5.6+ Standard PAYG deployments (Responses API path).
 *
 */
export type CacheControl = {
  type: 'ephemeral';
  /**
   * Time-to-live for the cache entry. Default is "5m" (5 minutes). "1h" (1 hour) is supported on select models (e.g. Claude Opus 4.5, Haiku 4.5, Sonnet 4.5).
   *
   */
  ttl?: '5m' | '1h';
};
