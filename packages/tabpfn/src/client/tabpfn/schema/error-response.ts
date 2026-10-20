/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Body of every error the application raises. Unrouted paths and wrong methods (404, 405) return `{"detail": "..."}` instead.
 */
export type ErrorResponse = {
  message: string;
  /**
   * `USER_ERROR` for 4xx, `BUSY` for a 503 from the concurrency limit, `INTERNAL_ERROR` for 5xx.
   * Default: "GENERAL_ERROR".
   */
  error_code?: string;
  /**
   * 32 hex characters identifying the request in the container's logs.
   */
  trace_id?: string | null;
};
