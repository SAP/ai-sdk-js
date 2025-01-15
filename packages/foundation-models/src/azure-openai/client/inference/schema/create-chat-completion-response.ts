/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiPromptFilterResults } from './prompt-filter-results.js';
import type { AzureOpenAiChatCompletionResponseMessage } from './chat-completion-response-message.js';
import type { AzureOpenAiContentFilterChoiceResults } from './content-filter-choice-results.js';
import type { AzureOpenAiChatCompletionTokenLogprob } from './chat-completion-token-logprob.js';
import type { AzureOpenAiCompletionUsage } from './completion-usage.js';
/**
 * Represents a chat completion response returned by model, based on the provided input.
 */
export type AzureOpenAiCreateChatCompletionResponse = {
  /**
   * A unique identifier for the chat completion.
   */
  id: string;
  prompt_filter_results?: AzureOpenAiPromptFilterResults;
  /**
   * A list of chat completion choices. Can be more than one if `n` is greater than 1.
   */
  choices: ({
    /**
     * The reason the model stopped generating tokens. This will be `stop` if the model hit a natural stop point or a provided stop sequence,
     * `length` if the maximum number of tokens specified in the request was reached,
     * `content_filter` if content was omitted due to a flag from our content filters,
     * `tool_calls` if the model called a tool, or `function_call` (deprecated) if the model called a function.
     *
     */
    finish_reason:
      | 'stop'
      | 'length'
      | 'tool_calls'
      | 'content_filter'
      | 'function_call';
    /**
     * The index of the choice in the list of choices.
     */
    index: number;
    message: AzureOpenAiChatCompletionResponseMessage;
    content_filter_results?: AzureOpenAiContentFilterChoiceResults;
    /**
     * Log probability information for the choice.
     */
    logprobs:
      | ({
          /**
           * A list of message content tokens with log probability information.
           */
          content: AzureOpenAiChatCompletionTokenLogprob[] | null;
          /**
           * A list of message refusal tokens with log probability information.
           */
          refusal: AzureOpenAiChatCompletionTokenLogprob[] | null;
        } & Record<string, any>)
      | null;
  } & Record<string, any>)[];
  /**
   * The Unix timestamp (in seconds) of when the chat completion was created.
   */
  created: number;
  /**
   * The model used for the chat completion.
   */
  model: string;
  /**
   * This fingerprint represents the backend configuration that the model runs with.
   *
   * Can be used in conjunction with the `seed` request parameter to understand when backend changes have been made that might impact determinism.
   *
   */
  system_fingerprint?: string;
  /**
   * The object type, which is always `chat.completion`.
   */
  object: 'chat.completion';
  usage?: AzureOpenAiCompletionUsage;
} & Record<string, any>;
