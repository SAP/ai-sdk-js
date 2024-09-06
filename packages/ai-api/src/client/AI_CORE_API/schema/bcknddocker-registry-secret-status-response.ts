/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BcknddockerRegistrySecretStatus } from './bcknddocker-registry-secret-status.js';
/**
 * This represents a list of meta-data of a stored secret. The 'data' field of the secret is never retrieved.
 */
export type BcknddockerRegistrySecretStatusResponse = {
  /**
   * Number of the resource instances in the list
   */
  count: number;
  resources: BcknddockerRegistrySecretStatus[];
} & Record<string, any>;
