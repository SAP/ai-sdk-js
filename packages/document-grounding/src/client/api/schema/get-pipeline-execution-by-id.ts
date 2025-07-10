/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { PipelineExecutionStatus } from './pipeline-execution-status.js';
/**
 * Representation of the 'GetPipelineExecutionById' schema.
 */
export type GetPipelineExecutionById = {
  /**
   * @example "uuid"
   */
  id?: string;
  /**
   * @example "2024-02-15T12:45:00Z"
   */
  createdAt?: string;
  /**
   * @example "2024-02-15T12:45:00Z"
   */
  modifiedAt?: string;
  status?: PipelineExecutionStatus;
} & Record<string, any>;
