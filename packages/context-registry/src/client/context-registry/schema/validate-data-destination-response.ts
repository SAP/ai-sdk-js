/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { ValidationFailedResponse } from './validation-failed-response.js';
import type { ValidationOkResponse } from './validation-ok-response.js';
/**
 * Representation of the 'ValidateDataDestinationResponse' schema.
 */
export type ValidateDataDestinationResponse =
  | ({ status: 'OK' } & ValidationOkResponse)
  | ({ status: 'FAILED' } & ValidationFailedResponse);
