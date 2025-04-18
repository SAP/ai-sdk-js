/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BckndResourceGroupLabels } from './bcknd-resource-group-labels.js';
/**
 * Representation of the 'BckndResourceGroupsPostRequest' schema.
 */
export type BckndResourceGroupsPostRequest = {
  /**
   * resource group id
   * Max Length: 253.
   * Min Length: 3.
   * Pattern: "^[a-zA-Z0-9][a-zA-Z0-9.-]{1,251}[a-zA-Z0-9]$".
   */
  resourceGroupId?: string;
  labels?: BckndResourceGroupLabels;
} & Record<string, any>;
