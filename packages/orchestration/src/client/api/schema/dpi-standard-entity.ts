/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DpiEntities } from './dpi-entities.js';
import type { DPIMethodConstant } from './dpi-method-constant.js';
import type { DPIMethodFabricatedData } from './dpi-method-fabricated-data.js';
/**
 * Representation of the 'DPIStandardEntity' schema.
 */
export type DPIStandardEntity = {
  type: DpiEntities;
  /**
   * Replacement strategy to be used for the entity
   */
  replacement_strategy?: DPIMethodConstant | DPIMethodFabricatedData;
};
