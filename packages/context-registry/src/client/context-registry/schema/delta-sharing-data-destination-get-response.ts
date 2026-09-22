/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { BaseDataDestinationResponse } from './base-data-destination-response.js';
/**
 * Representation of the 'DeltaSharingDataDestinationGetResponse' schema.
 */
export type DeltaSharingDataDestinationGetResponse =
  BaseDataDestinationResponse & {
    type: 'DELTA_SHARING';
    adapterType?: 'DeltaShare';
  } & Record<string, any>;
