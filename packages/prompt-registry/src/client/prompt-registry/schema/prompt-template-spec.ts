/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { Template } from './template.js';
import type { ResponseFormatText } from './response-format-text.js';
import type { ResponseFormatJsonObject } from './response-format-json-object.js';
import type { ResponseFormatJsonSchema } from './response-format-json-schema.js';
import type { ChatCompletionTool } from './chat-completion-tool.js';
/**
 * Representation of the 'PromptTemplateSpec' schema.
 */
export type PromptTemplateSpec = {
  template: Template[];
  defaults?: Record<string, any>;
  /**
   * DEPRECATED. Please use additional_fields instead.
   *
   * @deprecated
   */
  additionalFields?: Record<string, any>;
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
} & Record<string, Record<string, any>>;
