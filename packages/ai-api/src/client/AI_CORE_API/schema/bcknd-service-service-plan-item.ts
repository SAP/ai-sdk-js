/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BckndServiceServicePlanItemMetadata } from './bcknd-service-service-plan-item-metadata.js';
/**
 * Representation of the 'BckndServiceServicePlanItem' schema.
 */
export type BckndServiceServicePlanItem = {
  /**
   * description of the service plan
   */
  description?: string;
  /**
   * if the service plan free
   */
  free?: boolean;
  /**
   * id of the service plan
   */
  id?: string;
  /**
   * name of the service plan
   */
  name?: string;
  metadata?: BckndServiceServicePlanItemMetadata;
} & Record<string, any>;
