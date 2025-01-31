/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DocumentGroundingFilter } from './document-grounding-filter.js';
/**
 * Representation of the 'GroundingModuleConfig' schema.
 */
export type GroundingModuleConfig = {
  /**
   * @example "document_grounding_service"
   */
  type: 'document_grounding_service' | any;
  config: {
    /**
     * Document grounding service filters to be used
     */
    filters?: DocumentGroundingFilter[];
    /**
     * Contains the input parameters used for grounding input questions
     * Min Items: 1.
     */
    input_params: string[];
    /**
     * Parameter name used for grounding output
     * @example "groundingOutput"
     */
    output_param: string;
    /**
     * Parameter name used for specifying metadata parameters
     */
    metadata_params?: string[];
  };
};
