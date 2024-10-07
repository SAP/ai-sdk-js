/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'AzureOpenAiChatCompletionRequestMessageFunction' schema.
 */
export type AzureOpenAiChatCompletionRequestMessageFunction = {
  role: string;
} & {
  /**
   * The role of the messages author, in this case `function`.
   */
  role?: 'function';
  /**
   * The contents of the message.
   */
  name?: string;
  /**
   * The contents of the message.
   */
  content: string | null;
} & Record<string, any>;
