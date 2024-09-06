/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TrckLabelName } from './trck-label-name.js';
/**
 * a classifying phrase/name applied to a metric
 * @example {
 *   "name": "group",
 *   "value": "tree-82"
 * }
 */
export type TrckLabel = {
  name: TrckLabelName;
  /**
   * Metric Label Value
   * @example "sk_learn_random_forest_model"
   * Max Length: 256.
   * Min Length: 1.
   */
  value: string;
} & Record<string, any>;
