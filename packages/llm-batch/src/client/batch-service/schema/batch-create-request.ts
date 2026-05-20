/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BatchCreateRequest' schema.
 */
export type BatchCreateRequest = {
  /**
   * Type of batch processing
   */
  type: 'llm-native';
  input: {
    /**
     * Input file URI (must be .jsonl file)
     */
    uri: string;
  } & Record<string, any>;
  output: {
    /**
     * Output directory URI
     */
    uri: string;
  } & Record<string, any>;
  /**
   * Batch job specification
   */
  spec: {
    /**
     * LLM provider name
     */
    provider: string;
    /**
     * Model name
     */
    model: string;
  } & Record<string, any>;
} & Record<string, any>;
