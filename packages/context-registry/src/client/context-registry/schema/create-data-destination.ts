/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { AzureDataDestinationCreateRequest } from './azure-data-destination-create-request.js';
import type { DeltaSharingDataDestinationCreateRequest } from './delta-sharing-data-destination-create-request.js';
import type { GCSDataDestinationCreateRequest } from './gcs-data-destination-create-request.js';
import type { HDLDataDestinationCreateRequest } from './hdl-data-destination-create-request.js';
import type { S3DataDestinationCreateRequest } from './s-3-data-destination-create-request.js';
/**
 * Representation of the 'CreateDataDestination' schema.
 */
export type CreateDataDestination =
  | ({ type: 'HDL' } & HDLDataDestinationCreateRequest)
  | ({ type: 'S3' } & S3DataDestinationCreateRequest)
  | ({ type: 'GCS' } & GCSDataDestinationCreateRequest)
  | ({ type: 'AZURE' } & AzureDataDestinationCreateRequest)
  | ({ type: 'DELTA_SHARING' } & DeltaSharingDataDestinationCreateRequest);
