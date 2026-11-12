/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * **Deprecated.** Use `prompt_cache_breakpoint: {mode: explicit}` instead.
 * `cache_control` is Anthropic's native field name and was the original public API surface for this service. It is retained for backward compatibility with existing Anthropic consumers. New integrations should use `prompt_cache_breakpoint`.
 * For Anthropic models, `cache_control: {type: ephemeral}` continues to work and is translated to Anthropic's native `cache_control` on the wire. The `ttl` field is supported here for backward compatibility; new integrations should use `prompt_cache_breakpoint` with its `ttl` field instead.
 *
 * @deprecated
 */
export type CacheControl = {
  type: 'ephemeral';
  /**
   * Time-to-live for the cache entry. Default is "5m" (5 minutes). "1h" (1 hour) is supported on select models (e.g. Claude Opus 4.5, Haiku 4.5, Sonnet 4.5).
   *
   */
  ttl?: '5m' | '1h';
};
