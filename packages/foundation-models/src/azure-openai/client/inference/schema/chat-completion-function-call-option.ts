/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Specifying a particular function via `{"name": "my_function"}` forces the model to call that function.
 *
 */
export type AzureOpenAiChatCompletionFunctionCallOption = {
  /**
   * The name of the function to call.
   */
  name: string;
} & Record<string, any>;
