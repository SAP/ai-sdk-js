/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Specifies a tool the model should use. Use to force the model to call a specific function.
 */
export type AzureOpenAiChatCompletionNamedToolChoice = {
  /**
   * The type of the tool. Currently, only `function` is supported.
   */
  type: 'function';
  function: {
    /**
     * The name of the function to call.
     */
    name: string;
  } & Record<string, any>;
} & Record<string, any>;
