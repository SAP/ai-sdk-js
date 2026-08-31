/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationAsyncBaseDataDestinationResponse } from './data-destination-async-base-data-destination-response.js';
/**
 * Representation of the 'DataDestinationAsyncGetDataDestinationInternal' schema.
 */
export type DataDestinationAsyncGetDataDestinationInternal =
  DataDestinationAsyncBaseDataDestinationResponse & {
    type: string;
    config: Record<string, any>;
    /**
     * Subject pattern for HDL authentication and btp cred store
     */
    subjectPatterns?: string[];
  } & Record<string, any>;
