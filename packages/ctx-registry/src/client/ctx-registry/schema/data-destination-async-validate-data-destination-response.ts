/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DataDestinationAsyncValidationOkResponse } from './data-destination-async-validation-ok-response.js';
import type { DataDestinationCommonValidationFailedResponse } from './data-destination-common-validation-failed-response.js';
/**
 * Representation of the 'DataDestinationAsyncValidateDataDestinationResponse' schema.
 */
export type DataDestinationAsyncValidateDataDestinationResponse =
  | ({ status: 'OK' } & DataDestinationAsyncValidationOkResponse)
  | ({ status: 'FAILED' } & DataDestinationCommonValidationFailedResponse);
