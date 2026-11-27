/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Status code and message for an error response.
 */
export type ErrorStatus = {
  /**
   * Status code indicating the error category (2 = invalid input, 3 = internal error, 4 = overloaded, 5 = client disconnected, 6 = timeout).
   */
  code: number;
  /**
   * Human-readable status message.
   */
  message: string;
} & Record<string, any>;
