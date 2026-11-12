/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { CacheControl } from './cache-control.js';
import type { PromptCacheBreakpoint } from './prompt-cache-breakpoint.js';
/**
 * Representation of the 'TextContent' schema.
 */
export type TextContent = {
  type: 'text';
  text: string;
  prompt_cache_breakpoint?: PromptCacheBreakpoint;
  cache_control?: CacheControl;
};
