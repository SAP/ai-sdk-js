/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BckndResourceGroup } from './bcknd-resource-group';
/**
 * Representation of the 'BckndResourceGroupList' schema.
 */
export type BckndResourceGroupList = {
  /**
   * Number of the resource instances in the list
   */
  count: number;
  resources: BckndResourceGroup[];
} & Record<string, any>;
