/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Common log record.
 */
export type AiLogCommonResultItem = {
  /**
   * Datetime in RFC 3339.
   * @example "2021-05-19T00:00:14.347+00:00"
   * Format: "date-time".
   */
  timestamp?: string;
  /**
   * message content.
   */
  msg?: string;
} & Record<string, any>;
