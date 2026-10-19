/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ValidateAzureRequest } from './validate-azure-request.js';
import type { ValidateGCSRequest } from './validate-gcs-request.js';
import type { ValidateS3Request } from './validate-s-3-request.js';
/**
 * Representation of the 'ValidateDataDestinationRequest' schema.
 */
export type ValidateDataDestinationRequest =
  | ({ type: 'S3' } & ValidateS3Request)
  | ({ type: 'GCS' } & ValidateGCSRequest)
  | ({ type: 'AZURE' } & ValidateAzureRequest);
