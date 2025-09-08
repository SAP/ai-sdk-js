/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DPIEntityConfig } from './dpi-entity-config.js';
/**
 * Representation of the 'DPIConfig' schema.
 */
export type DPIConfig = {
  /**
   * Type of masking service provider
   */
  type: 'sap_data_privacy_integration';
  /**
   * Type of masking method to be used
   */
  method: 'anonymization' | 'pseudonymization';
  /**
   * List of entities to be masked
   * Min Items: 1.
   */
  entities: DPIEntityConfig[];
  /**
   * List of strings that should not be masked
   * @example [
   *   "SAP",
   *   "Joule"
   * ]
   */
  allowlist?: string[];
  mask_grounding_input?: {
    /**
     * controls whether the input to the grounding module will be masked with the configuration supplied in the masking module
     */
    enabled?: boolean;
  };
};
