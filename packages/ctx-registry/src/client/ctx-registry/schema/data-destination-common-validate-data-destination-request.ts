/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationCommonValidateS3Request } from './data-destination-common-validate-s-3-request.js';
import type { DataDestinationCommonValidateGCSRequest } from './data-destination-common-validate-gcs-request.js';
import type { DataDestinationCommonValidateAzureRequest } from './data-destination-common-validate-azure-request.js';
/**
 * Representation of the 'DataDestinationCommonValidateDataDestinationRequest' schema.
 */
export type DataDestinationCommonValidateDataDestinationRequest =
  | ({ type: 'S3' } & DataDestinationCommonValidateS3Request)
  | ({ type: 'GCS' } & DataDestinationCommonValidateGCSRequest)
  | ({ type: 'AZURE' } & DataDestinationCommonValidateAzureRequest);
