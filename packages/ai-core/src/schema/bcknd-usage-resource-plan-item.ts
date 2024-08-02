/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BckndNestedUsageItem } from './bcknd-nested-usage-item';
/**
 * Representation of the 'BckndUsageResourcePlanItem' schema.
 */
export type BckndUsageResourcePlanItem = {
  plan: string;
  count: number;
  usage: BckndNestedUsageItem[];
} & Record<string, any>;
