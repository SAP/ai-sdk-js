/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BckndService } from './bcknd-service.js';
/**
 * Representation of the 'BckndServiceList' schema.
 */
export type BckndServiceList = {
  /**
   * Number of the resource instances in the list
   */
  count: number;
  resources: BckndService[];
} & Record<string, any>;
