/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { PipelineExecutionStatus } from './pipeline-execution-status.js';
/**
 * Representation of the 'PipelineExecutionData' schema.
 */
export type PipelineExecutionData = {
  /**
   * @example "uuid"
   */
  id?: string;
  status?: PipelineExecutionStatus;
} & Record<string, any>;
