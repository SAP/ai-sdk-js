/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MaskingProviderConfig } from './masking-provider-config.js';
/**
 * Representation of the 'MaskingModuleConfig' schema.
 */
export interface MaskingModuleConfig {
  /**
   * List of masking service providers
   * Min Items: 1.
   */
  masking_providers: MaskingProviderConfig[];
}
