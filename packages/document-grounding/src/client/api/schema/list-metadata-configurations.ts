/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MetadataConfigurationResponse } from './metadata-configuration-response.js';
/**
 * Representation of the 'ListMetadataConfigurations' schema.
 */
export type ListMetadataConfigurations = {
  /**
   * Total number of metadata configurations returned.
   * @example 1
   */
  count?: number;
  /**
   * List of metadata configuration objects. It will be empty array if no records found.
   */
  resources?: MetadataConfigurationResponse[];
} & Record<string, any>;
