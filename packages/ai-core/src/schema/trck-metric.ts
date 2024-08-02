/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TrckMetricName } from './trck-metric-name';
import type { TrckMetricValue } from './trck-metric-value';
import type { TrckTimestamp } from './trck-timestamp';
import type { TrckLabelList } from './trck-label-list';
/**
 * Key-value metrics, where the value is numeric. Metric can also have optional step and label fields.
 */
export type TrckMetric = {
  name: TrckMetricName;
  value: TrckMetricValue;
  timestamp?: TrckTimestamp;
  /**
   * step is an optional integer that represents any measurement of training progress (number of training iterations, number of epochs, and so on) for the metric
   * @example 2
   */
  step?: number;
  labels?: TrckLabelList;
} & Record<string, any>;
