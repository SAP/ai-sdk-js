/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureContentSafety } from './azure-content-safety';
/**
 * Representation of the 'AzureContentSafetyFilterConfig' schema.
 */
export type AzureContentSafetyFilterConfig = {
  /**
   * String represents name of the filter provider
   * @example "azure_content_safety"
   */
  type: 'azure_content_safety';
  config?: AzureContentSafety;
} & Record<string, any>;
