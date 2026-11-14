/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'LabelKeyValuePair' schema.
 */
export type LabelKeyValuePair = {
  /**
   * Label key must start with 'ext.ai.sap.com/' and follow the pattern
   * Max Length: 63.
   * Min Length: 1.
   * Pattern: "^(ext)\\.ai\\.sap\\.com/(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]){1,48}$".
   */
  key: string;
  /**
   * Label value
   * Max Length: 63.
   * Min Length: 1.
   * Pattern: "^(([A-Za-z0-9][-A-Za-z0-9_./]*)?[A-Za-z0-9])?$".
   */
  value: string;
};
