/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'ErrorResponse' schema.
 */
export type ErrorResponse = {
  /**
   * @example "d4a67ea1-2bf9-4df7-8105-d48203ccff76"
   */
  request_id: string;
  /**
   * @example 400
   */
  code: number;
  /**
   * @example "Model name must be one of ['gpt-4', ...]"
   */
  message: string;
  /**
   * Where the error occurred
   * @example "LLM Module"
   */
  location: string;
} & Record<string, any>;
