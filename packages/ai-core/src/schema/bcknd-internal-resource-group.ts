/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BckndInternalResourceGroupLabels } from './bcknd-internal-resource-group-labels';
import type { BckndInternalResourceGroupAnnotations } from './bcknd-internal-resource-group-annotations';
/**
 * Representation of the 'BckndInternalResourceGroup' schema.
 */
export type BckndInternalResourceGroup = {
  /**
   * resource group id
   */
  resourceGroupId: string;
  /**
   * tenant id
   */
  tenantId?: string;
  /**
   * zone id
   */
  zoneId?: string;
  /**
   * Timestamp of resource group creation
   * Format: "date-time".
   */
  createdAt: string;
  labels?: BckndInternalResourceGroupLabels;
  /**
   * aggregated status of the onboarding process
   */
  status: 'PROVISIONED' | 'ERROR' | 'PROVISIONING';
  /**
   * status message
   */
  statusMessage?: string;
  annotations?: BckndInternalResourceGroupAnnotations;
} & Record<string, any>;
