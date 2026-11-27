/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * A single error entry describing one problem with the request.
 */
export type ErrorDetail = {
  /**
   * Path to the offending field in the request (empty for errors not tied to a specific field).
   */
  loc: (string | number)[];
  /**
   * Human-readable description of the error.
   */
  msg: string;
  /**
   * Machine-readable error type identifier.
   */
  type: string;
} & Record<string, any>;
