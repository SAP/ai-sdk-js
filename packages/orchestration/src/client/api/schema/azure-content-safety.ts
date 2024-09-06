/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AzureThreshold } from './azure-threshold.js';
/**
 * Filter configuration for Azure Content Safety.
 */
export interface AzureContentSafety {
  Hate?: AzureThreshold;
  SelfHarm?: AzureThreshold;
  Sexual?: AzureThreshold;
  Violence?: AzureThreshold;
}
