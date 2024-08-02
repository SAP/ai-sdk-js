/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { RTABackendDetails } from './rta-backend-details';
/**
 * Representation of the 'RTADeploymentDetails' schema.
 */
export type RTADeploymentDetails = {
  scaling?: RTABackendDetails;
  resources?: RTABackendDetails;
} & Record<string, any>;
