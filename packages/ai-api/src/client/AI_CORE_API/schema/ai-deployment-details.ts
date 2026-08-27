/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

import type { AiResourcesDetails } from './ai-resources-details.js';
import type { AiScalingDetails } from './ai-scaling-details.js';
/**
 * Detail information about a deployment (including predefined sections: `scaling` and `resources`).
 * JSON String representation of this object is limited to 5000 characters
 *
 */
export type AiDeploymentDetails = {
  scaling?: AiScalingDetails;
  resources?: AiResourcesDetails;
} & Record<string, any>;
