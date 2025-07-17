/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { PipelineExecutionStatus } from './pipeline-execution-status.js';
/**
 * Representation of the 'GetPipelineStatus' schema.
 */
export type GetPipelineStatus = {
  /**
   * @example "2024-02-15T12:45:00.000Z"
   * Pattern: "^$|^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{3})?Z$".
   */
  lastStarted?: string;
  status?: PipelineExecutionStatus;
} & Record<string, any>;
