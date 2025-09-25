/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'PipelineExecutionData' schema.
 */
export type PipelineExecutionData = {
  /**
   * @example "uuid"
   */
  id?: string;
  status?:
    | 'NEW'
    | 'UNKNOWN'
    | 'INPROGRESS'
    | 'FINISHED'
    | 'FINISHEDWITHERRORS'
    | 'TIMEOUT'
    | string;
  /**
   * @example "2024-02-15T12:45:00Z"
   * Pattern: "^$|^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{3})?Z$".
   */
  createdAt?: string | null;
  /**
   * @example "2024-02-15T12:45:00Z"
   * Pattern: "^$|^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{3})?Z$".
   */
  modifiedAt?: string | null;
} & Record<string, any>;
