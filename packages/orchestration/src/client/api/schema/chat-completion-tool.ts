/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { CacheControl } from './cache-control.js';
import type { FunctionObject } from './function-object.js';
import type { PromptCacheBreakpoint } from './prompt-cache-breakpoint.js';
/**
 * Representation of the 'ChatCompletionTool' schema.
 */
export type ChatCompletionTool = {
  /**
   * The type of the tool. Currently, only `function` is supported.
   */
  type: 'function';
  function: FunctionObject;
  prompt_cache_breakpoint?: PromptCacheBreakpoint;
  cache_control?: CacheControl;
};
