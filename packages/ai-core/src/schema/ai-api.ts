/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { Spec } from './spec.js';
import type { AiApiCapabilities } from './ai-api-capabilities.js';
import type { AiApiLimits } from './ai-api-limits.js';
/**
 * There are (currently) the following types of execution engines  1) complete runtimes that offer executions and deployments, 2) runtimes that do only batch inference and therefore don't support deployments 3) runtimes that allow deployments, but with predefined models and therefore don't need executions 4) runtimes that have fixed endpoints and therefore only need listing deployments
 */
export type AiApi = Spec & {
  capabilities?: AiApiCapabilities;
  limits?: AiApiLimits;
} & Record<string, any>;
