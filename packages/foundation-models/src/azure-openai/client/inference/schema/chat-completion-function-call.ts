/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Deprecated and replaced by `tool_calls`. The name and arguments of a function that should be called, as generated by the model.
 */
export type AzureOpenAiChatCompletionFunctionCall = {
  /**
   * The name of the function to call.
   */
  name: string;
  /**
   * The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code before calling your function.
   */
  arguments: string;
} & Record<string, any>;
