/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiChatCompletionToolType } from './chat-completion-tool-type.js';
import type { AzureOpenAiChatCompletionFunctionParameters } from './chat-completion-function-parameters.js';
/**
 * Representation of the 'AzureOpenAiChatCompletionTool' schema.
 */
export type AzureOpenAiChatCompletionTool = {
  type: AzureOpenAiChatCompletionToolType;
  function: {
    /**
     * A description of what the function does, used by the model to choose when and how to call the function.
     */
    description?: string;
    /**
     * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.
     */
    name: string;
    parameters: AzureOpenAiChatCompletionFunctionParameters;
  } & Record<string, any>;
} & Record<string, any>;
