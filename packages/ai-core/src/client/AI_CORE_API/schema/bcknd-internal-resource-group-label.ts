/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BckndInternalResourceGroupLabel' schema.
 */
export type BckndInternalResourceGroupLabel = {
  /**
   * @example "internal.ai.sap.com/my-label"
   * Max Length: 63.
   * Pattern: "^internal.ai.sap.com/(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]){1,43}$".
   */
  key: string;
  /**
   * Max Length: 5000.
   */
  value: string;
} & Record<string, any>;
