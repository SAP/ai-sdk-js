/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { Metric } from './metric.js';
import type { Timestamp } from './timestamp.js';
/**
 * Representation of the 'GetMetric' schema.
 */
export type GetMetric = Metric & {
  timestamp: Timestamp;
} & Record<string, any>;
