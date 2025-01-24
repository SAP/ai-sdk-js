/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'RTAArtifactLabel' schema.
 */
export type RTAArtifactLabel = {
  /**
   * @example "ext.ai.sap.com/s4hana-version"
   * Max Length: 256.
   * Pattern: "^ext\\.ai\\.sap\\.com\\/[\\w\\.-]+$".
   */
  key: string;
  /**
   * Max Length: 5000.
   */
  value: string;
} & Record<string, any>;
