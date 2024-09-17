/**
 * Azure OpenAI system message.
 */
export interface AzureOpenAiChatSystemMessage {
  /**
   * The role of the messages author,.
   */
  role: 'system';
  /**
   * An optional name for the participant. Provides the model information to differentiate between participants of the same role.
   */
  name?: string;
  /**
   * The contents of the system message.
   */
  content: string;
}

/**
 * Azure OpenAI user message.
 */
export interface AzureOpenAiChatUserMessage {
  /**
   * The role of the messages author,.
   */
  role: 'user';
  /**
   * An optional name for the participant. Provides the model information to differentiate between participants of the same role.
   */
  name?: string;
  /**
   * The contents of the user message.
   */
  content:
    | string
    | (
        | {
            /**
             * The type of the content part.
             */
            type: 'text';
            /**
             * The text content.
             */
            text: string;
          }
        | {
            /**
             * The type of the content part.
             */
            type: 'image_url';
            image_url:
              | string
              | {
                  /**
                   * Either a URL of the image or the base64 encoded image data.
                   */
                  url: string;
                  /**
                   * Specifies the detail level of the image.
                   * @default auto
                   */
                  detail?: 'auto' | 'low' | 'high';
                };
          }
      )[];
}

/**
 * Azure OpenAI assistant message.
 */
export interface AzureOpenAiChatAssistantMessage {
  /**
   * The role of the messages author,.
   */
  role: 'assistant';
  /**
   * An optional name for the participant. Provides the model information to differentiate between participants of the same role.
   */
  name?: string;
  /**
   * Message content.
   */
  content?: string;
  /**
   * Function which is called.
   * @deprecated In favor of `tool_calls`.
   */
  function_call?: AzureOpenAiChatFunctionCall;
  /**
   * The tool calls generated by the model, such as function calls.
   */
  tool_calls?: AzureOpenAiChatToolCall[];
}

/**
 * Azure OpenAI tool message.
 */
export interface AzureOpenAiChatToolMessage {
  /**
   * The role of the messages author,.
   */
  role: 'tool';
  /**
   * The contents of the tool message.
   */
  content: string;
  /**
   * Tool call that this message is responding to.
   */
  tool_call_id: string;
}

/**
 * Azure OpenAI function message.
 */
export interface AzureOpenAiChatFunctionMessage {
  /**
   * The role of the messages author,.
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
}

/**
 * Azure OpenAI chat message types.
 */
export type AzureOpenAiChatMessage =
  | AzureOpenAiChatSystemMessage
  | AzureOpenAiChatUserMessage
  | AzureOpenAiChatAssistantMessage
  | AzureOpenAiChatToolMessage
  | AzureOpenAiChatFunctionMessage;

/**
 * Azure OpenAI function signature.
 */
export interface AzureOpenAiChatCompletionFunction {
  /**
   * Name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.
   */
  name: string;
  /**
   * Description of the function.
   */
  description?: string;
  /**
   * JSON Schema for the function input parameters.
   *
   * **Note**: As mentioned in {@link https://community.openai.com/t/whitch-json-schema-version-should-function-calling-use/283535/4}, it follows JSON Schema 7 (2020-12).
   * Not all JSON Schema parameters in the specification are supported by Azure OpenAI.
   */
  parameters: Record<string, unknown>;
}

/**
 * Azure OpenAI tool signature.
 */
export interface AzureOpenAiChatCompletionTool {
  /**
   * The type of the tool.
   */
  type: 'function';
  /**
   * Function signature.
   */
  function: AzureOpenAiChatCompletionFunction;
}

/**
 * Azure OpenAI function call by AI.
 */
export interface AzureOpenAiChatFunctionCall {
  /**
   * Name of the function call.
   */
  name: string;
  /**
   * The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code before calling your function.
   */
  arguments: string;
}

/**
 * Azure OpenAI tool call by AI.
 */
export interface AzureOpenAiChatToolCall {
  /**
   * The ID of the tool call.
   */
  id: string;
  /**
   * The type of the tool.
   */
  type: 'function';
  /**
   * The function that the model called.
   */
  function: AzureOpenAiChatFunctionCall;
}

/**
 * Azure OpenAI completion input parameters.
 */
export interface AzureOpenAiCompletionParameters {
  /**
   * The maximum number of [tokens](/tokenizer) that can be generated in the completion. The token count of your prompt plus max_tokens can't exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
   */
  max_tokens?: number;
  /**
   * What sampling temperature to use, between 0 and 2. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (`argmax sampling`) for ones with a well-defined answer. We generally recommend altering this or top_p but not both.
   */
  temperature?: number;
  /**
   * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both.
   */
  top_p?: number;
  /**
   * Modify the likelihood of specified tokens appearing in the completion. Accepts a json object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this tokenizer tool (which works for both GPT-2 and GPT-3) to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token. As an example, you can pass {"50256": -100} to prevent the <|endoftext|> token from being generated.
   */
  logit_bias?: Record<string, unknown>;
  /**
   * A unique identifier representing your end-user, which can help monitoring and detecting abuse.
   */
  user?: string;
  /**
   * How many completions to generate for each prompt. Note: Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for max_tokens and stop.
   */
  n?: number;
  /**
   * Up to four sequences where the API will stop generating further tokens. The returned text won't contain the stop sequence.
   */
  stop?: string | string[];
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
   */
  presence_penalty?: number;
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
   */
  frequency_penalty?: number;
}

/**
 * Azure OpenAI chat completion input parameters.
 */
export interface AzureOpenAiChatCompletionParameters
  extends AzureOpenAiCompletionParameters {
  /**
   * An array of system, user & assistant messages for chat completion.
   */
  messages: AzureOpenAiChatMessage[];
  /**
   * An object specifying the format that the model must output. Setting to { "type": "json_object" } enables JSON mode, which guarantees the message the model generates is valid JSON.
   *
   * **Important**: when using JSON mode, you *must* also instruct the model to produce JSON yourself via a system or user message. Without this, the model may generate an unending stream of whitespace until the generation reaches the token limit, resulting in a long-running and seemingly "stuck" request. Also note that the message content may be partially cut off if `finish_reason="length"`, which indicates the generation exceeded `max_tokens` or the conversation exceeded the max context length.
   */
  response_format?: {
    /**
     * Type of response format.
     * @default text
     */
    type: 'text' | 'json_object';
  };
  /**
   * If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same `seed` and parameters should return the same result. Determinism is not guaranteed, and you should refer to the `system_fingerprint` response parameter to monitor changes in the backend.
   */
  seed?: number;
  /**
   * Array of function signatures to be called.
   * @deprecated Use `tools` instead.
   */
  functions?: AzureOpenAiChatCompletionFunction[];
  /**
   * A list of tools the model may call. Currently, only functions are supported as a tool. Use this to provide a list of functions the model may generate JSON inputs for.
   */
  tools?: AzureOpenAiChatCompletionTool[];
  /**
   * Controls which (if any) function is called by the model.
   *
   * - `none` means the model will not call a function and instead generates a message.
   * - `auto` means the model can pick between generating a message or calling a function.
   * - Specifying a particular function via `{"type": "function", "function": {"name": "my_function"}}` forces the model to call that function.
   */
  tool_choice?:
    | 'none'
    | 'auto'
    | {
        /**
         * The type of the tool.
         */
        type: 'function';
        /**
         * Use to force the model to call a specific function.
         */
        function: {
          /**
           * The name of the function to call.
           */
          name: string;
        };
      };
}

/**
 * Azure OpenAI embedding input parameters.
 */
export interface AzureOpenAiEmbeddingParameters {
  /**
   * Input text to get embeddings for, encoded as a string. The number of input tokens varies depending on what model you are using. Unless you're embedding code, we suggest replacing newlines (\n) in your input with a single space, as we have observed inferior results when newlines are present.
   */
  input: string[] | string;
  /**
   * A unique identifier representing for your end-user. This will help Azure OpenAI monitor and detect abuse. Do not pass PII identifiers instead use pseudoanonymized values such as GUIDs.
   */
  user?: string;
}

/**
 * Usage statistics for the completion request.
 */
export interface AzureOpenAiUsage {
  /**
   * Tokens consumed for output text completion.
   */
  completion_tokens: number;
  /**
   * Tokens consumed for input prompt tokens.
   */
  prompt_tokens: number;
  /**
   * Total tokens consumed for input + output.
   */
  total_tokens: number;
}

/**
 * Azure OpenAI completion output .
 */
export interface AzureOpenAiCompletionOutput {
  /**
   *
   */
  created: number;
  /**
   * Unique ID for completion.
   */
  id: string;
  /**
   * Name of the model used for completion.
   */
  model: string;
  /**
   * Completion object.
   */
  object: 'chat.completion' | 'text_completion';
  /**
   * Token usage.
   */
  usage: AzureOpenAiUsage;
  /**
   * Content filtering results for zero or more prompts in the request.
   */
  prompt_filter_results?: AzureOpenAiPromptFilterResult[];
}

/**
 * Azure OpenAI chat completion output.
 */
export interface AzureOpenAiChatCompletionOutput
  extends AzureOpenAiCompletionOutput {
  /**
   * Array of result candidates.
   */
  choices: AzureOpenAiChatCompletionChoice[];
  /**
   * This fingerprint represents the backend configuration that the model runs with.
   * Can be used in conjunction with the `seed` request parameter to understand when backend changes have been made that might impact determinism.
   */
  system_fingerprint: string;
}

/**
 * Content filtering results for a single prompt in the request.
 */
export interface AzureOpenAiPromptFilterResult {
  /**
   * Index of the prompt in the request.
   */
  prompt_index?: number;
  /**
   * Information about the content filtering category, if it has been detected, as well as the severity level and if it has been filtered or not.
   */
  content_filter_results?: AzureOpenAiContentFilterPromptResults;
}

/**
 * Azure OpenAI completion choice.
 */
export interface AzureOpenAiCompletionChoice {
  /**
   * Reason for finish.
   */
  finish_reason?: string;
  /**
   * Index of choice.
   */
  index: number;
  /**
   * Information about the content filtering category, if it has been detected, as well as the severity level and if it has been filtered or not.
   */
  content_filter_results?: AzureOpenAiContentFilterPromptResults;
}

/**
 * Azure OpenAI chat completion choice.
 */
export interface AzureOpenAiChatCompletionChoice
  extends AzureOpenAiCompletionChoice {
  /**
   * Completion chat message.
   */
  message: AzureOpenAiChatAssistantMessage;
}

/**
 * Information about the content filtering results.
 */
export interface AzureOpenAiContentFilterResultsBase {
  /**
   * Sexual content filter result.
   */
  sexual?: AzureOpenAiContentFilterSeverityResult;

  /**
   * Violent content filter result.
   */
  violence?: AzureOpenAiContentFilterSeverityResult;

  /**
   * Hate speech content filter result.
   */
  hate?: AzureOpenAiContentFilterSeverityResult;

  /**
   * Intolerant content filter result.
   */
  selfHarm?: AzureOpenAiContentFilterSeverityResult;

  /**
   * Profanity content filter result.
   */
  profanity?: AzureOpenAiContentFilterDetectedResult;

  /**
   * Error.
   */
  error?: AzureOpenAiErrorBase;
}

/**
 * Content filtering results for a prompt in the request.
 */
export interface AzureOpenAiContentFilterPromptResults
  extends AzureOpenAiContentFilterResultsBase {
  /**
   *
   */
  jailbreak?: AzureOpenAiContentFilterDetectedResult;
}

/**
 * Azure OpenAI content filter result.
 */
export interface AzureOpenAiContentFilterResultBase {
  /**
   * Whether the content was filtered.
   */
  filtered: boolean;
}

/**
 * Azure OpenAI content filter detected result.
 */
export interface AzureOpenAiContentFilterDetectedResult
  extends AzureOpenAiContentFilterResultBase {
  /**
   * Whether the content was detected.
   */
  detected: boolean;
}

/**
 * Azure OpenAI error.
 */
export interface AzureOpenAiErrorBase {
  /**
   * Error code.
   */
  code?: string;

  /**
   * Error message.
   */
  message?: string;
}

/**
 * Information about the content filtering results.
 */
export interface AzureOpenAiContentFilterSeverityResult
  extends AzureOpenAiContentFilterResultBase {
  /**
   * Severity of the content.
   */
  severity: 'safe' | 'low' | 'medium' | 'high';
}

/**
 * Azure OpenAI embedding output.
 */
export interface AzureOpenAiEmbeddingOutput {
  /**
   * List object.
   */
  object: 'list';
  /**
   * Model used for embedding.
   */
  model: string;
  /**
   * Array of result candidates.
   */
  data: [
    {
      /**
       * Embedding object.
       */
      object: 'embedding';
      /**
       * Array of size `1536` (Azure OpenAI's embedding size) containing embedding vector.
       */
      embedding: number[];
      /**
       * Index of choice.
       */
      index: number;
    }
  ];
  /**
   * Token Usage.
   */
  usage: {
    /**
     * Tokens consumed for input prompt tokens.
     */
    prompt_tokens: number;
    /**
     * Total tokens consumed.
     */
    total_tokens: number;
  };
}