/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BckndServiceServicePlanItem } from './bcknd-service-service-plan-item.js';
/**
 * Representation of the 'BckndServiceServiceCatalogItemExtendCatalog' schema.
 */
export type BckndServiceServiceCatalogItemExtendCatalog = {
  /**
   * if the service is bindable
   */
  bindable?: boolean;
  /**
   * description of the service
   */
  description?: string;
  /**
   * id of the service
   */
  id?: string;
  /**
   * name of the service
   */
  name?: string;
  plans?: BckndServiceServicePlanItem[];
} & Record<string, any>;
