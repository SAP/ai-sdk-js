/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BckndUsageResourcePlanItem } from './bcknd-usage-resource-plan-item';
/**
 * Representation of the 'BckndDeploymentUsage' schema.
 */
export type BckndDeploymentUsage = {
  count: number;
  resourcePlans: BckndUsageResourcePlanItem[];
} & Record<string, any>;
