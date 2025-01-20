/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiFunctionParameters } from './function-parameters.js';
/**
 * Representation of the 'AzureOpenAiChatCompletionFunctions' schema.
 * @deprecated
 */
export type AzureOpenAiChatCompletionFunctions = {
  /**
   * A description of what the function does, used by the model to choose when and how to call the function.
   */
  description?: string;
  /**
   * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.
   */
  name: string;
  parameters?: AzureOpenAiFunctionParameters;
} & Record<string, any>;
