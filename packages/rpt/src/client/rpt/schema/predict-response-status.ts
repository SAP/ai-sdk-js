/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Output status for prediction requests.
 */
export type PredictResponseStatus = {
  /**
   * Status code (zero means success, other status codes indicate warnings)
   */
  code: number;
  /**
   * Status message, either "ok" or contains a warning / more information.
   */
  message: string;
} & Record<string, any>;
