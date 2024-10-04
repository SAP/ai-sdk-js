/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiChatCompletionsRequestCommon } from './chat-completions-request-common.js';
import type { AzureOpenAiChatCompletionRequestMessage } from './chat-completion-request-message.js';
import type { AzureOpenAiAzureChatExtensionConfiguration } from './azure-chat-extension-configuration.js';
import type { AzureOpenAiChatCompletionResponseFormat } from './chat-completion-response-format.js';
import type { AzureOpenAiChatCompletionTool } from './chat-completion-tool.js';
import type { AzureOpenAiChatCompletionToolChoiceOption } from './chat-completion-tool-choice-option.js';
import type { AzureOpenAiChatCompletionFunction } from './chat-completion-function.js';
/**
 * Representation of the 'AzureOpenAiCreateChatCompletionRequest' schema.
 */
export type AzureOpenAiCreateChatCompletionRequest =
  AzureOpenAiChatCompletionsRequestCommon & {
    /**
     * A list of messages comprising the conversation so far. [Example Python code](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_format_inputs_to_ChatGPT_models.ipynb).
     * Min Items: 1.
     */
    messages: AzureOpenAiChatCompletionRequestMessage[];
    /**
     * The configuration entries for Azure OpenAI chat extensions that use them.
     * This additional specification is only compatible with Azure OpenAI.
     */
    data_sources?: AzureOpenAiAzureChatExtensionConfiguration[];
    /**
     * How many chat completion choices to generate for each input message.
     * @example 1
     * Default: 1.
     * Maximum: 128.
     * Minimum: 1.
     */
    n?: number | null;
    /**
     * If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same `seed` and parameters should return the same result.Determinism is not guaranteed, and you should refer to the `system_fingerprint` response parameter to monitor changes in the backend.
     * @example 1
     * Maximum: 9223372036854776000.
     * Minimum: -9223372036854776000.
     */
    seed?: number | null;
    /**
     * Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the `content` of `message`. This option is currently not available on the `gpt-4-vision-preview` model.
     */
    logprobs?: boolean | null;
    /**
     * An integer between 0 and 5 specifying the number of most likely tokens to return at each token position, each with an associated log probability. `logprobs` must be set to `true` if this parameter is used.
     * Maximum: 5.
     */
    top_logprobs?: number | null;
    /**
     * An object specifying the format that the model must output. Used to enable JSON mode.
     */
    response_format?: {
      type?: AzureOpenAiChatCompletionResponseFormat;
    } & Record<string, any>;
    /**
     * A list of tools the model may call. Currently, only functions are supported as a tool. Use this to provide a list of functions the model may generate JSON inputs for.
     * Min Items: 1.
     */
    tools?: AzureOpenAiChatCompletionTool[];
    tool_choice?: AzureOpenAiChatCompletionToolChoiceOption;
    /**
     * Deprecated in favor of `tools`. A list of functions the model may generate JSON inputs for.
     * Min Items: 1.
     * Max Items: 128.
     */
    functions?: AzureOpenAiChatCompletionFunction[];
    /**
     * Deprecated in favor of `tool_choice`. Controls how the model responds to function calls. "none" means the model does not call a function, and responds to the end-user. "auto" means the model can pick between an end-user or calling a function.  Specifying a particular function via `{"name":\ "my_function"}` forces the model to call that function. "none" is the default when no functions are present. "auto" is the default if functions are present.
     */
    function_call?:
      | 'none'
      | 'auto'
      | ({
          /**
           * The name of the function to call.
           */
          name: string;
        } & Record<string, any>);
  } & Record<string, any>;
