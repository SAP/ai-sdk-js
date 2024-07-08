/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ExecutableResourceQuotaResponseUsage } from './executable-resource-quota-response-usage.js';
import type { ExecutableResourceQuotaResponseQuota } from './executable-resource-quota-response-quota.js';
/**
 * Representation of the 'ExecutableResourceQuotaResponse' schema.
 */
export type ExecutableResourceQuotaResponse = {
  usage?: ExecutableResourceQuotaResponseUsage;
  quota: ExecutableResourceQuotaResponseQuota;
} & Record<string, any>;
