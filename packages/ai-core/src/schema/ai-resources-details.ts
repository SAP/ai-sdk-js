/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiBackendDetails } from './ai-backend-details';
/**
 * Resources details of a deployment
 * @example {
 *   "backendDetails": {
 *     "predictor": {
 *       "resourcePlan": "starter"
 *     }
 *   }
 * }
 */
export type AiResourcesDetails = {
  backendDetails?: AiBackendDetails;
} & Record<string, any>;
