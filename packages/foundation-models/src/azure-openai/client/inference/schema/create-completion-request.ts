/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'AzureOpenAiCreateCompletionRequest' schema.
 */
export type AzureOpenAiCreateCompletionRequest = {
  /**
   * The prompt(s) to generate completions for, encoded as a string, array of strings, array of tokens, or array of token arrays.
   *
   * Note that <|endoftext|> is the document separator that the model sees during training, so if a prompt is not specified the model will generate as if from the beginning of a new document.
   *
   * Default: "<|endoftext|>".
   */
  prompt: string | string[] | null;
  /**
   * Generates `best_of` completions server-side and returns the "best" (the one with the highest log probability per token). Results cannot be streamed.
   *
   * When used with `n`, `best_of` controls the number of candidate completions and `n` specifies how many to return â€“ `best_of` must be greater than `n`.
   *
   * **Note:** Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for `max_tokens` and `stop`.
   *
   * Default: 1.
   * Maximum: 20.
   */
  best_of?: number | null;
  /**
   * Echo back the prompt in addition to the completion
   *
   */
  echo?: boolean | null;
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
   *
   * Maximum: 2.
   * Minimum: -2.
   */
  frequency_penalty?: number | null;
  /**
   * Modify the likelihood of specified tokens appearing in the completion.
   *
   * Accepts a JSON object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this [tokenizer tool](https://platform.openai.com/tokenizer?view=bpe) to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.
   *
   * As an example, you can pass `{"50256": -100}` to prevent the <|endoftext|> token from being generated.
   *
   */
  logit_bias?: Record<string, number> | null;
  /**
   * Include the log probabilities on the `logprobs` most likely output tokens, as well the chosen tokens. For example, if `logprobs` is 5, the API will return a list of the 5 most likely tokens. The API will always return the `logprob` of the sampled token, so there may be up to `logprobs+1` elements in the response.
   *
   * The maximum value for `logprobs` is 5.
   *
   * Maximum: 5.
   */
  logprobs?: number | null;
  /**
   * The maximum number of [tokens](https://platform.openai.com/tokenizer) that can be generated in the completion.
   *
   * The token count of your prompt plus `max_tokens` cannot exceed the model's context length. [Example Python code](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken) for counting tokens.
   *
   * @example 16
   * Default: 16.
   */
  max_tokens?: number | null;
  /**
   * How many completions to generate for each prompt.
   *
   * **Note:** Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for `max_tokens` and `stop`.
   *
   * @example 1
   * Default: 1.
   * Maximum: 128.
   * Minimum: 1.
   */
  n?: number | null;
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
   *
   * Maximum: 2.
   * Minimum: -2.
   */
  presence_penalty?: number | null;
  /**
   * If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same `seed` and parameters should return the same result.
   *
   * Determinism is not guaranteed, and you should refer to the `system_fingerprint` response parameter to monitor changes in the backend.
   *
   * Maximum: 9223372036854776000.
   * Minimum: -9223372036854776000.
   */
  seed?: number | null;
  /**
   * Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.
   *
   */
  stop?: string | string[] | null;
  /**
   * Whether to stream back partial progress. If set, tokens will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available, with the stream terminated by a `data: [DONE]` message. [Example Python code](https://cookbook.openai.com/examples/how_to_stream_completions).
   *
   */
  stream?: boolean | null;
  /**
   * The suffix that comes after a completion of inserted text.
   *
   * This parameter is only supported for `gpt-3.5-turbo-instruct`.
   *
   * @example "test."
   */
  suffix?: string | null;
  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
   *
   * We generally recommend altering this or `top_p` but not both.
   *
   * @example 1
   * Default: 1.
   * Maximum: 2.
   */
  temperature?: number | null;
  /**
   * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.
   *
   * We generally recommend altering this or `temperature` but not both.
   *
   * @example 1
   * Default: 1.
   * Maximum: 1.
   */
  top_p?: number | null;
  /**
   * A unique identifier representing your end-user, which can help to monitor and detect abuse.
   *
   * @example "user-1234"
   */
  user?: string;
} & Record<string, any>;
