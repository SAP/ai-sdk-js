/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Configuration for a target column in the prediction model.
 */
export type TargetColumnConfig = {
  /**
   * The name of the target column.
   */
  name: string;
  /**
   * The placeholder value in any column for which to predict a value. The model will predict a value for all table cells containing this value.
   */
  prediction_placeholder: string | number;
  /**
   * The type of prediction task for this column. If not provided, the model will infer the task type from the data.
   */
  task_type?: 'classification' | 'regression' | null;
} & Record<string, any>;
