/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { GroundingFilter } from './grounding-filter.js';
/**
 * Representation of the 'GroundingModuleConfig' schema.
 */
export type GroundingModuleConfig = {
  /**
   * @example "document_grounding_service"
   */
  grounding_service: 'document_grounding_service';
  grounding_service_configuration?: {
    /**
     * Document grounding service filters to be used.
     */
    filters?: GroundingFilter[];
    /**
     * Contains the input parameters used for grounding input questions.
     */
    grounding_input_parameters: string[];
    /**
     * Parameter name used for grounding output.
     * @example "groundingOutput"
     */
    grounding_output_parameter: string;
  } & Record<string, any>;
} & Record<string, any>;
