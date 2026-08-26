/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationAsyncBaseDataDestinationResponse } from './data-destination-async-base-data-destination-response.js';
/**
 * Representation of the 'DataDestinationAsyncDeltaSharingDataDestinationGetResponse' schema.
 */
export type DataDestinationAsyncDeltaSharingDataDestinationGetResponse =
  DataDestinationAsyncBaseDataDestinationResponse & {
    type: 'DELTA_SHARING';
    adapterType?: 'DeltaShare';
  } & Record<string, any>;
