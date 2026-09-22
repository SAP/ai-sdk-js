/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'Label' schema.
 */
export type Label = {
  /**
   * Label key must start with 'ext.ai.sap.com/' and follow the pattern
   * @example "ext.ai.sap.com/environment"
   * Max Length: 63.
   * Min Length: 1.
   * Pattern: "^(ext)\\.ai\\.sap\\.com\\/(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]){1,48}$".
   */
  key: string;
  /**
   * Label value
   * @example "production"
   * Max Length: 63.
   * Min Length: 1.
   * Pattern: "^(([A-Za-z0-9][-A-Za-z0-9_.\\/]*)?[A-Za-z0-9])?$".
   */
  value: string;
};
