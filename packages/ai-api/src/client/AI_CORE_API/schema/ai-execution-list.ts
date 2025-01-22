/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiExecution } from './ai-execution.js';
/**
 * Representation of the 'AiExecutionList' schema.
 */
export type AiExecutionList = {
  /**
   * Number of the resource instances in the list
   */
  count: number;
  resources: AiExecution[];
} & Record<string, any>;
