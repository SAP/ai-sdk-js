/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { FunctionObject } from './function-object.js';
import type { CacheControl } from './cache-control.js';
/**
 * Representation of the 'SchemasChatCompletionTool' schema.
 */
export type SchemasChatCompletionTool = {
  /**
   * The type of the tool. Currently, only `function` is supported.
   */
  type: 'function';
  function: FunctionObject;
  cache_control?: CacheControl;
};
