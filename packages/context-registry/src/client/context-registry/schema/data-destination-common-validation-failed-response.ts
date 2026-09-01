/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'DataDestinationCommonValidationFailedResponse' schema.
 */
export type DataDestinationCommonValidationFailedResponse = {
  status: 'FAILED';
  /**
   * Provider-specific failure reason. Always present when status is FAILED.
   */
  reason: string;
};
