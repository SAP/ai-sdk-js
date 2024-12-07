/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiContentFilterChoiceResults } from './content-filter-choice-results.js';
import type { AzureOpenAiPromptFilterResults } from './prompt-filter-results.js';
import type { AzureOpenAiCompletionUsage } from './completion-usage.js';
/**
 * Represents a completion response from the API. Note: both the streamed and non-streamed response objects share the same shape (unlike the chat endpoint).
 *
 */
export type AzureOpenAiCreateCompletionResponse = {
  /**
   * A unique identifier for the completion.
   */
  id: string;
  /**
   * The list of completion choices the model generated for the input prompt.
   */
  choices: ({
    /**
     * The reason the model stopped generating tokens. This will be `stop` if the model hit a natural stop point or a provided stop sequence,
     * `length` if the maximum number of tokens specified in the request was reached,
     * or `content_filter` if content was omitted due to a flag from our content filters.
     *
     */
    finish_reason: 'stop' | 'length' | 'content_filter';
    index: number;
    logprobs:
      | ({
          text_offset?: number[];
          token_logprobs?: number[];
          tokens?: string[];
          top_logprobs?: Record<string, number>[];
        } & Record<string, any>)
      | null;
    text: string;
    content_filter_results?: AzureOpenAiContentFilterChoiceResults;
  } & Record<string, any>)[];
  /**
   * The Unix timestamp (in seconds) of when the completion was created.
   */
  created: number;
  /**
   * The model used for completion.
   */
  model: string;
  prompt_filter_results?: AzureOpenAiPromptFilterResults;
  /**
   * This fingerprint represents the backend configuration that the model runs with.
   *
   * Can be used in conjunction with the `seed` request parameter to understand when backend changes have been made that might impact determinism.
   *
   */
  system_fingerprint?: string;
  /**
   * The object type, which is always "text_completion"
   */
  object: 'text_completion';
  usage?: AzureOpenAiCompletionUsage;
} & Record<string, any>;
