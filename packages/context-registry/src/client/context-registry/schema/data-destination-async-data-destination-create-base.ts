/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationCommonLabels } from './data-destination-common-labels.js';
/**
 * Representation of the 'DataDestinationAsyncDataDestinationCreateBase' schema.
 */
export type DataDestinationAsyncDataDestinationCreateBase = {
  /**
   * Optional description of the data destination
   * Max Length: 1000.
   */
  description?: string;
  /**
   * Adapter type for data access.
   * Default: "File".
   */
  adapterType?: 'File' | 'DeltaShare';
  labels?: DataDestinationCommonLabels;
} & Record<string, any>;
