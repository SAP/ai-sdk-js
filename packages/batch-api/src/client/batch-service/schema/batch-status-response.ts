/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BatchStatusResponse' schema.
 */
export type BatchStatusResponse = {
  current_status?: string;
  target_status?: string;
  /**
   * Format: "date-time".
   */
  updated_at?: string;
  message?: string | null;
} & Record<string, any>;
