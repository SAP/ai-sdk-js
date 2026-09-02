/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { BaseDataDestinationResponse } from './base-data-destination-response.js';
/**
 * Representation of the 'HDLDataDestinationGetResponse' schema.
 */
export type HDLDataDestinationGetResponse = BaseDataDestinationResponse & {
  type: 'HDL';
  adapterType?: 'File';
  /**
   * Subject pattern for HDL authentication and btp cred store
   */
  subjectPatterns?: string[];
} & Record<string, any>;
