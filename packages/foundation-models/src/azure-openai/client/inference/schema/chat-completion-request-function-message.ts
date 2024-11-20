/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'AzureOpenAiChatCompletionRequestFunctionMessage' schema.
 * @deprecated
 */
export type AzureOpenAiChatCompletionRequestFunctionMessage = {
  /**
   * The role of the messages author, in this case `function`.
   */
  role: 'function';
  /**
   * The contents of the function message.
   */
  content: string | null;
  /**
   * The name of the function to call.
   */
  name: string;
} & Record<string, any>;
