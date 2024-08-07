/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TrckGetMetricResource } from './trck-get-metric-resource.js';
/**
 * Representation of the 'TrckGetMetricResourceList' schema.
 */
export type TrckGetMetricResourceList = {
  /**
   * Number of the resource instances in the list
   */
  count?: number;
  resources: TrckGetMetricResource[];
} & Record<string, any>;
