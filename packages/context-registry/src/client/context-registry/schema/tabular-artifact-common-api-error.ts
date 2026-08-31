/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { TabularArtifactCommonDetailsErrorResponse } from './tabular-artifact-common-details-error-response.js';
/**
 * Representation of the 'TabularArtifactCommonApiError' schema.
 */
export type TabularArtifactCommonApiError = {
  /**
   * Descriptive error code (not http status code)
   */
  code: string;
  /**
   * plaintext error description
   */
  message: string;
  /**
   * id of individual request
   */
  requestId?: string;
  /**
   * url that has been called
   */
  target?: string;
  details?: TabularArtifactCommonDetailsErrorResponse[];
} & Record<string, any>;
