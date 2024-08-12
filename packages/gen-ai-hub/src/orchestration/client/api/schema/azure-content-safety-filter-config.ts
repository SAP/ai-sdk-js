/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureContentSafety } from './azure-content-safety.js';
/**
 * Representation of the 'AzureContentSafetyFilterConfig' schema.
 */
export type AzureContentSafetyFilterConfig = {
  /**
   * String represents name of the filter provider.
   */
  type: 'azure_content_safety';
  /**
   * Filter configuration for Azure Content Azure Content Safety.
   */
  config?: AzureContentSafety;
} & Record<string, any>;
