import type { DataDestinationAsyncDataDestinationErrorMessage } from './data-destination-async-data-destination-error-message.js';
import type { DataDestinationAsyncDataDestinationStatus } from './data-destination-async-data-destination-status.js';
/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationCommonLabels } from './data-destination-common-labels.js';
/**
 * Representation of the 'DataDestinationAsyncBaseDataDestinationResponse' schema.
 */
export type DataDestinationAsyncBaseDataDestinationResponse = {
  name: string;
  description?: string | null;
  labels?: DataDestinationCommonLabels;
  status?: DataDestinationAsyncDataDestinationStatus;
  errorMessage?: DataDestinationAsyncDataDestinationErrorMessage;
  /**
   * @example "2024-02-15T12:45:00.000Z"
   * Format: "date-time".
   */
  createdAt: string;
  /**
   * @example "2024-02-15T12:45:00.000Z"
   * Format: "date-time".
   */
  updatedAt: string;
} & Record<string, any>;
