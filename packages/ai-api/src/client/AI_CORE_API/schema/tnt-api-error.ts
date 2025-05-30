/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'TntApiError' schema.
 */
export type TntApiError = {
  /**
   * Descriptive error code (not http status code)
   */
  code: string;
  /**
   * Plaintext error description
   */
  message: string;
  /**
   * ID of the individual request
   */
  requestId?: string;
  /**
   * Invoked URL
   */
  target?: string;
  /**
   * Optional details of the error message
   */
  details?: Record<string, any>;
} & Record<string, any>;
