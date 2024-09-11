/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'RTALabel' schema.
 */
export type RTALabel = {
  /**
   * @example "ai.sap.com/scenarioName"
   * Pattern: "^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)*ai\\.sap\\.com\\/[\\w\\.-]+$".
   */
  key: string;
  /**
   * Max Length: 5000.
   */
  value: string;
} & Record<string, any>;
