/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { FunctionObject } from './function-object.js';
/**
 * Representation of the 'ChatCompletionTool' schema.
 */
export type ChatCompletionTool = {
  /**
   * The type of the tool. Currently, only `function` is supported.
   */
  type: 'function';
  function: FunctionObject;
};
