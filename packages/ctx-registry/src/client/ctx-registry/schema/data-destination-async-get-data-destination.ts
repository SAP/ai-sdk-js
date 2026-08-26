/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationAsyncHDLDataDestinationGetResponse } from './data-destination-async-hdl-data-destination-get-response.js';
import type { DataDestinationAsyncObjectStoreDataDestinationGetResponse } from './data-destination-async-object-store-data-destination-get-response.js';
import type { DataDestinationAsyncDeltaSharingDataDestinationGetResponse } from './data-destination-async-delta-sharing-data-destination-get-response.js';
/**
 * Representation of the 'DataDestinationAsyncGetDataDestination' schema.
 */
export type DataDestinationAsyncGetDataDestination =
  | ({ type: 'HDL' } & DataDestinationAsyncHDLDataDestinationGetResponse)
  | ({ type: 'S3' } & DataDestinationAsyncObjectStoreDataDestinationGetResponse)
  | ({
      type: 'GCS';
    } & DataDestinationAsyncObjectStoreDataDestinationGetResponse)
  | ({
      type: 'AZURE';
    } & DataDestinationAsyncObjectStoreDataDestinationGetResponse)
  | ({
      type: 'DELTA_SHARING';
    } & DataDestinationAsyncDeltaSharingDataDestinationGetResponse);
