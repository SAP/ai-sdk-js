/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BckndGenericSecretDetails } from './bcknd-generic-secret-details';
/**
 * This represents a list of meta-data of the secret. The 'data' field of the secret is never retrieved.
 */
export type BckndListGenericSecretsResponse = {
  /**
   * Number of the resource instances in the list
   */
  count: number;
  resources: BckndGenericSecretDetails[];
} & Record<string, any>;
