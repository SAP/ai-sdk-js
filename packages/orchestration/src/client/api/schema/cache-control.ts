/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Cache control directive for prompt caching. When set on a content block, marks it as a cache breakpoint.
 * **Note:** this field has no equivalent in the standard OpenAI Chat Completions API. It is modelled on Anthropic's prompt caching API and is a custom extension introduced by this service.
 * Supported providers:
 * - **Anthropic Claude models** — maps to Anthropic's native `cache_control` header. - **Azure OpenAI GPT-5.6+ Standard PAYG deployments** — translated to
 *   `prompt_cache_breakpoint: {mode: explicit}` on the wire. Supported on user
 *   message content blocks (text, image, file) on both the Responses API path
 *   (GPT-6+ models) and the Chat Completions path (GPT-5.6 models). System message
 *   cache breakpoints are not supported on Azure. Not supported on PTU-M deployments.
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
