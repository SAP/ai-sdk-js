/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'ErrorResponse' schema.
 */
export type ErrorResponse = {
  /**
   * What went wrong.
   */
  message: string;
  /**
   * Machine-readable error category, such as `BUSY`.
   * Default: "GENERAL_ERROR".
   */
  error_code?: string;
  /**
   * Id to quote when reporting the error.
   */
  trace_id?: string | null;
};
