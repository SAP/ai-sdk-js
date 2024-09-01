/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'OpenAiChatCompletionsRequestCommon' schema.
 */
export type OpenAiChatCompletionsRequestCommon = {
  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
   * We generally recommend altering this or `top_p` but not both.
   * @example 1
   * Default: 1.
   * Maximum: 2.
   */
  temperature?: number;
  /**
   * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.
   * We generally recommend altering this or `temperature` but not both.
   * @example 1
   * Default: 1.
   * Maximum: 1.
   */
  top_p?: number;
  /**
   * If set, partial message deltas will be sent, like in ChatGPT. Tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a `data: [DONE]` message.
   */
  stream?: boolean;
  /**
   * Up to 4 sequences where the API will stop generating further tokens.
   */
  stop?: string | string[];
  /**
   * The maximum number of tokens allowed for the generated answer. By default, the number of tokens the model can return will be (4096 - prompt tokens).
   * Default: 4096.
   */
  max_tokens?: number;
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
   * Maximum: 2.
   * Minimum: -2.
   */
  presence_penalty?: number;
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
   * Maximum: 2.
   * Minimum: -2.
   */
  frequency_penalty?: number;
  /**
   * Modify the likelihood of specified tokens appearing in the completion. Accepts a json object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.
   */
  logit_bias?: Record<string, any>;
  /**
   * A unique identifier representing your end-user, which can help Azure OpenAI to monitor and detect abuse.
   * @example "user-1234"
   */
  user?: string;
} & Record<string, any>;
