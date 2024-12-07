/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiChatCompletionNamedToolChoice } from './chat-completion-named-tool-choice.js';
/**
 * Controls which (if any) tool is called by the model. `none` means the model will not call any tool and instead generates a message. `auto` means the model can pick between generating a message or calling one or more tools. `required` means the model must call one or more tools. Specifying a particular tool via `{"type": "function", "function": {"name": "my_function"}}` forces the model to call that tool. `none` is the default when no tools are present. `auto` is the default if tools are present.
 */
export type AzureOpenAiChatCompletionToolChoiceOption =
  | 'none'
  | 'auto'
  | 'required'
  | AzureOpenAiChatCompletionNamedToolChoice;
