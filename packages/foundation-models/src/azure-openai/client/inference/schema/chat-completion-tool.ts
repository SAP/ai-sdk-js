/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiFunctionObject } from './function-object.js';
/**
 * Representation of the 'AzureOpenAiChatCompletionTool' schema.
 */
export type AzureOpenAiChatCompletionTool = {
  /**
   * The type of the tool. Currently, only `function` is supported.
   */
  type: 'function';
  function: AzureOpenAiFunctionObject;
} & Record<string, any>;
