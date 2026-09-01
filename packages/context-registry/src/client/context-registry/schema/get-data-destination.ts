/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { DeltaSharingDataDestinationGetResponse } from './delta-sharing-data-destination-get-response.js';
import type { HDLDataDestinationGetResponse } from './hdl-data-destination-get-response.js';
import type { ObjectStoreDataDestinationGetResponse } from './object-store-data-destination-get-response.js';
/**
 * Representation of the 'GetDataDestination' schema.
 */
export type GetDataDestination =
  | ({ type: 'HDL' } & HDLDataDestinationGetResponse)
  | ({ type: 'S3' } & ObjectStoreDataDestinationGetResponse)
  | ({ type: 'GCS' } & ObjectStoreDataDestinationGetResponse)
  | ({ type: 'AZURE' } & ObjectStoreDataDestinationGetResponse)
  | ({ type: 'DELTA_SHARING' } & DeltaSharingDataDestinationGetResponse);
