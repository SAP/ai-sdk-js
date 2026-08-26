/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationAsyncHDLDataDestinationCreateRequest } from './data-destination-async-hdl-data-destination-create-request.js';
import type { DataDestinationAsyncS3DataDestinationCreateRequest } from './data-destination-async-s-3-data-destination-create-request.js';
import type { DataDestinationAsyncGCSDataDestinationCreateRequest } from './data-destination-async-gcs-data-destination-create-request.js';
import type { DataDestinationAsyncAzureDataDestinationCreateRequest } from './data-destination-async-azure-data-destination-create-request.js';
import type { DataDestinationAsyncDeltaSharingDataDestinationCreateRequest } from './data-destination-async-delta-sharing-data-destination-create-request.js';
/**
 * Representation of the 'DataDestinationAsyncCreateDataDestination' schema.
 */
export type DataDestinationAsyncCreateDataDestination =
  | ({ type: 'HDL' } & DataDestinationAsyncHDLDataDestinationCreateRequest)
  | ({ type: 'S3' } & DataDestinationAsyncS3DataDestinationCreateRequest)
  | ({ type: 'GCS' } & DataDestinationAsyncGCSDataDestinationCreateRequest)
  | ({ type: 'AZURE' } & DataDestinationAsyncAzureDataDestinationCreateRequest)
  | ({
      type: 'DELTA_SHARING';
    } & DataDestinationAsyncDeltaSharingDataDestinationCreateRequest);
