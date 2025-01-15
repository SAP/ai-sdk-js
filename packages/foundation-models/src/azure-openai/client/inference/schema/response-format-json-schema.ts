/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureOpenAiResponseFormatJsonSchemaSchema } from './response-format-json-schema-schema.js';
/**
 * Representation of the 'AzureOpenAiResponseFormatJsonSchema' schema.
 */
export type AzureOpenAiResponseFormatJsonSchema = {
  /**
   * The type of response format being defined: `json_schema`
   */
  type: 'json_schema';
  json_schema: {
    /**
     * A description of what the response format is for, used by the model to determine how to respond in the format.
     */
    description?: string;
    /**
     * The name of the response format. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.
     */
    name: string;
    schema?: AzureOpenAiResponseFormatJsonSchemaSchema;
    /**
     * Whether to enable strict schema adherence when generating the output. If set to true, the model will always follow the exact schema defined in the `schema` field. Only a subset of JSON Schema is supported when `strict` is `true`.
     */
    strict?: boolean | null;
  } & Record<string, any>;
} & Record<string, any>;
