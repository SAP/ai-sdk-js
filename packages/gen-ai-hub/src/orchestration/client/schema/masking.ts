/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MaskingProviderType } from './masking-provider-type.js';
import type { DPIEntities } from './dpi-entities.js';
import type { PresidioEntities } from './presidio-entities.js';
/**
 * Representation of the 'Masking' schema.
 */
export type Masking = {
  type: MaskingProviderType;
  /**
   * List of entities to be masked.
   */
  entities: DPIEntities | PresidioEntities[];
} & Record<string, any>;
