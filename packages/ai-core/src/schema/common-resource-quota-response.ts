/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { CommonResourceQuotaResponseUsage } from './common-resource-quota-response-usage.js';
import type { CommonResourceQuotaResponseQuota } from './common-resource-quota-response-quota.js';
/**
 * Representation of the 'CommonResourceQuotaResponse' schema.
 */
export type CommonResourceQuotaResponse = {
  usage?: CommonResourceQuotaResponseUsage;
  quota: CommonResourceQuotaResponseQuota;
} & Record<string, any>;
