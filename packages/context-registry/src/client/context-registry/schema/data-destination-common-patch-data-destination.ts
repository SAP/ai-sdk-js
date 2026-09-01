import type { DataDestinationCommonAzurePatchConfig } from './data-destination-common-azure-patch-config.js';
import type { DataDestinationCommonGCSPatchConfig } from './data-destination-common-gcs-patch-config.js';
/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationCommonLabels } from './data-destination-common-labels.js';
import type { DataDestinationCommonS3PatchConfig } from './data-destination-common-s-3-patch-config.js';
/**
 * Representation of the 'DataDestinationCommonPatchDataDestination' schema.
 */
export type DataDestinationCommonPatchDataDestination = {
  labels?: DataDestinationCommonLabels;
  /**
   * Data destination description.
   * Max Length: 253.
   */
  description?: string;
  /**
   * Credential fields for the destination's provider type.
   */
  config?:
    | DataDestinationCommonS3PatchConfig
    | DataDestinationCommonGCSPatchConfig
    | DataDestinationCommonAzurePatchConfig;
};
