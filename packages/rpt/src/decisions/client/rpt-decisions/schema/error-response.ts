/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ErrorDetail } from './error-detail.js';
import type { ErrorStatus } from './error-status.js';
/**
 * Error response body returned for all non-2xx responses.
 */
export type ErrorResponse = {
  /**
   * Unique ID for the request.
   */
  id: string;
  /**
   * Status code and message describing the error category.
   */
  status: ErrorStatus;
  /**
   * List of individual errors. May be empty for errors without field-level detail.
   */
  detail: ErrorDetail[];
} & Record<string, any>;
