/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { DataDestinationErrorMessage } from './data-destination-error-message.js';
import type { DataDestinationStatus } from './data-destination-status.js';
import type { Labels } from './labels.js';
/**
 * Representation of the 'BaseDataDestinationResponse' schema.
 */
export type BaseDataDestinationResponse = {
  name: string;
  description?: string | null;
  labels?: Labels;
  status?: DataDestinationStatus;
  errorMessage?: DataDestinationErrorMessage;
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
