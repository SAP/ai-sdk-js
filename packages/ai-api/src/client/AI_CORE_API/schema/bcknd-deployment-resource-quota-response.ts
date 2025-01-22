/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BckndDeploymentUsage } from './bcknd-deployment-usage.js';
import type { BckndDeploymentQuotaItem } from './bcknd-deployment-quota-item.js';
/**
 * Representation of the 'BckndDeploymentResourceQuotaResponse' schema.
 */
export type BckndDeploymentResourceQuotaResponse = {
  usage?: BckndDeploymentUsage;
  quotas: BckndDeploymentQuotaItem[];
} & Record<string, any>;
