/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'DocumentMetadataUpdateError' schema.
 */
export type DocumentMetadataUpdateError = {
  /**
   * Document ID that caused the error.
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  target: string;
  /**
   * HTTP error status code.
   * @example 500
   */
  code: number;
  /**
   * Error message.
   * @example "Some unexpected error occurred."
   */
  message: string;
} & Record<string, any>;
