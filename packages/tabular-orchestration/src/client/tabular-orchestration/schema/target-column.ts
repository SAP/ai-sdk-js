/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TaskTypeEnum } from './task-type-enum.js';
/**
 * Configuration for a target column to predict.
 */
export type TargetColumn = {
  /**
   * Name of the column to predict
   */
  name: string;
  /**
   * (Optional) Placeholder value indicating cells to predict
   * Default: "[PREDICT]".
   */
  prediction_placeholder?: string;
  task_type?: TaskTypeEnum;
  /**
   * (Optional) Controls how many labels to predict for each column in each row. Only applicable to 'classification' task type.
   * Default: 1.
   */
  top_k?: number;
} & Record<string, any>;
