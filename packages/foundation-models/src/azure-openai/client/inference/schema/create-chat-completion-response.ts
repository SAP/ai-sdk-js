/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiChatCompletionsResponseCommon } from './chat-completions-response-common.js';
import type { AzureOpenAiPromptFilterResults } from './prompt-filter-results.js';
import type { AzureOpenAiChatCompletionChoiceCommon } from './chat-completion-choice-common.js';
import type { AzureOpenAiChatCompletionResponseMessage } from './chat-completion-response-message.js';
import type { AzureOpenAiContentFilterChoiceResults } from './content-filter-choice-results.js';
import type { AzureOpenAiChatCompletionChoiceLogProbs } from './chat-completion-choice-log-probs.js';
/**
 * Representation of the 'AzureOpenAiCreateChatCompletionResponse' schema.
 */
export type AzureOpenAiCreateChatCompletionResponse =
  AzureOpenAiChatCompletionsResponseCommon & {
    prompt_filter_results?: AzureOpenAiPromptFilterResults;
    choices: (AzureOpenAiChatCompletionChoiceCommon & {
      message?: AzureOpenAiChatCompletionResponseMessage;
      content_filter_results?: AzureOpenAiContentFilterChoiceResults;
      logprobs?: AzureOpenAiChatCompletionChoiceLogProbs;
    } & Record<string, any>)[];
  } & Record<string, any>;
