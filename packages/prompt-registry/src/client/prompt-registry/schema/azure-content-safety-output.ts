/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureThreshold } from './azure-threshold.js';
/**
 * Filter configuration for Azure Content Safety
 */
export type AzureContentSafetyOutput = {
  hate?: AzureThreshold;
  self_harm?: AzureThreshold;
  sexual?: AzureThreshold;
  violence?: AzureThreshold;
  /**
   * Detect protected code content from known GitHub repositories. The scan includes software libraries, source code, algorithms, and other proprietary programming content.
   */
  protected_material_code?: boolean;
};
