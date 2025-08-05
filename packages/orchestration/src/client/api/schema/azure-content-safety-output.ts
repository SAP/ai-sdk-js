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
  Hate?: AzureThreshold;
  SelfHarm?: AzureThreshold;
  Sexual?: AzureThreshold;
  Violence?: AzureThreshold;
};
