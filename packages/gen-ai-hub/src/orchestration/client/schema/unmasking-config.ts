/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DPIEntities } from './dpi-entities.js';
import type { PresidioEntities } from './presidio-entities.js';
/**
 * Representation of the 'UnmaskingConfig' schema.
 */
export type UnmaskingConfig = {
  /**
   * List of entities to be unmasked.
   */
  entities: DPIEntities | PresidioEntities[];
} & Record<string, any>;
