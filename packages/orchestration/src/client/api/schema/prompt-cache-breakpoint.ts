/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Marks the end of a reusable prompt prefix for explicit prompt caching. Content up to and including the marked block is eligible for caching.
 * This is the native Azure OpenAI / OpenAI field name. The orchestration service passes it through unchanged for Azure models and translates it to the appropriate provider-native format for other providers.
 * Supported providers:
 * - **Azure OpenAI GPT-5.6+ Standard PAYG deployments** — passed through as
 *   `prompt_cache_breakpoint: {mode: explicit}` on the wire. Supported on user
 *   message content blocks (text, image, file) on both the Chat Completions path
 *   (GPT-5.6 models) and the Responses API path (GPT-6+ models). System message
 *   breakpoints are not supported on Azure. Configure cache TTL and mode through
 *   `prompt_cache_options`. Not supported on PTU-M deployments. The prompt prefix
 *   through the breakpoint must contain at least 1,024 tokens to be cacheable.
 * - **Anthropic Claude models** — translated to `cache_control: {type: ephemeral}`
 *   on the wire. The `ttl` field maps to Anthropic's native `ttl` on the cache
 *   control block; if omitted the Anthropic default applies. TTL is ignored for
 *   Azure (use `prompt_cache_options.ttl` instead).
 * - **AWS Bedrock Anthropic models** — translated to `cachePoint: {type: default}`
 *   on the wire. The `ttl` field is ignored (Bedrock does not support TTL on cache
 *   points).
 *
 */
export type PromptCacheBreakpoint = {
  /**
   * Default: "explicit".
   */
  mode: 'explicit';
  /**
   * Optional cache TTL hint. Supported on Anthropic models only; ignored for Azure (configure TTL via `prompt_cache_options.ttl`) and AWS Bedrock. Allowed values match Anthropic's supported TTLs.
   *
   */
  ttl?: '5m' | '1h';
};
