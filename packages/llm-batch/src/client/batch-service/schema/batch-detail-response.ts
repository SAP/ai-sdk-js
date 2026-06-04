/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BatchDetailResponse' schema.
 */
export type BatchDetailResponse = {
  /**
   * Format: "uuid".
   */
  id?: string;
  type?: string;
  provider?: string;
  /**
   * Format: "date-time".
   */
  created_at?: string;
  input?: {
    uri?: string;
  } & Record<string, any>;
  output?: {
    uri?: string;
  } & Record<string, any>;
  spec?: Record<string, any>;
  status?: {
    current_status?: string;
    target_status?: string;
    /**
     * Format: "date-time".
     */
    updated_at?: string;
    message?: string | null;
  } & Record<string, any>;
} & Record<string, any>;
