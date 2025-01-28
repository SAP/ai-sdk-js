/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiBackendDetails } from './ai-backend-details.js';
/**
 * Scaling details of a deployment
 * @example {
 *   "backendDetails": {
 *     "predictor": {
 *       "minReplicas": 0,
 *       "maxReplicas": 2,
 *       "runningReplicas": 1
 *     }
 *   }
 * }
 */
export type AiScalingDetails = {
  backendDetails?: AiBackendDetails;
} & Record<string, any>;
