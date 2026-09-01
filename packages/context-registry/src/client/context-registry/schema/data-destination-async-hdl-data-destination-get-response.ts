/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationAsyncBaseDataDestinationResponse } from './data-destination-async-base-data-destination-response.js';
/**
 * Representation of the 'DataDestinationAsyncHDLDataDestinationGetResponse' schema.
 */
export type DataDestinationAsyncHDLDataDestinationGetResponse =
  DataDestinationAsyncBaseDataDestinationResponse & {
    type: 'HDL';
    adapterType?: 'File';
    /**
     * Subject pattern for HDL authentication and btp cred store
     */
    subjectPatterns?: string[];
  } & Record<string, any>;
