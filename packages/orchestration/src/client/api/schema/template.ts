/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TemplatingChatMessage } from './templating-chat-message.js';
import type { ResponseFormatText } from './response-format-text.js';
import type { ResponseFormatJsonObject } from './response-format-json-object.js';
import type { ResponseFormatJsonSchema } from './response-format-json-schema.js';
import type { ChatCompletionTool } from './chat-completion-tool.js';
/**
 * Representation of the 'Template' schema.
 * @example {
 *   "template": [
 *     {
 *       "role": "user",
 *       "content": "How can the features of AI in SAP BTP specifically {{?groundingOutput}}, be applied to {{?inputContext}}"
 *     }
 *   ],
 *   "defaults": {
 *     "inputContext": "The default text that will be used in the template if inputContext is not set"
 *   }
 * }
 */
export type Template = {
  /**
   * A chat message array to be formatted with values from input_params. Both role and content can be templated. If messages_history is provided, the templated messages will be appended.
   */
  template: TemplatingChatMessage;
  /**
   * Optional default values for the template. If a parameter has no default it is required.
   */
  defaults?: Record<string, string>;
  /**
   * Response format that the model output should adhere to. This is the same as the OpenAI definition.
   * Compatible with GPT-4o, GPT-4o mini, GPT-4 (Turbo) and all GPT-3.5 Turbo models newer than gpt-3.5-turbo-1106.
   *
   */
  response_format?:
    | ResponseFormatText
    | ResponseFormatJsonObject
    | ResponseFormatJsonSchema;
  /**
   * A list of tools the model may call. Used to provide a list of functions the model may generate JSON inputs for. This is the same as the OpenAI definition.
   *
   */
  tools?: ChatCompletionTool[];
};
