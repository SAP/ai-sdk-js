/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiChatCompletionNamedToolChoice } from './chat-completion-named-tool-choice.js';
/**
 * Controls which (if any) function is called by the model. `none` means the model will not call a function and instead generates a message. `auto` means the model can pick between generating a message or calling a function. Specifying a particular function via `{"type": "function", "function": {"name": "my_function"}}` forces the model to call that function.
 */
export type AzureOpenAiChatCompletionToolChoiceOption =
  | 'none'
  | 'auto'
  | 'required'
  | AzureOpenAiChatCompletionNamedToolChoice;
