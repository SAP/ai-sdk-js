/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiChatCompletionFunctionParameters } from './chat-completion-function-parameters.js';
/**
 * Representation of the 'AzureOpenAiChatCompletionFunction' schema.
 */
export type AzureOpenAiChatCompletionFunction = {
  /**
   * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.
   */
  name: string;
  /**
   * The description of what the function does.
   */
  description?: string;
  parameters?: AzureOpenAiChatCompletionFunctionParameters;
} & Record<string, any>;
