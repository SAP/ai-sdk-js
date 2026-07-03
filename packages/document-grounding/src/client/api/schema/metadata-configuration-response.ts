/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { MetadataConfigurationRequest } from './metadata-configuration-request.js';
/**
 * Representation of the 'MetadataConfigurationResponse' schema.
 */
export type MetadataConfigurationResponse = MetadataConfigurationRequest & {
  /**
   * Status of metadata enumeration for the configuration.
   * @example "IN_PROGRESS"
   */
  enumerationStatus?: 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'ERROR' | any;
} & Record<string, any>;
