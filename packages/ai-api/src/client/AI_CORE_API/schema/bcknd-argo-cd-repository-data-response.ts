/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { BckndArgoCDRepositoryDetails } from './bcknd-argo-cd-repository-details.js';
/**
 * This represents a list of GitOps repositories for the tenant.
 */
export type BckndArgoCDRepositoryDataResponse = {
  /**
   * Number of the resource instances in the list
   */
  count: number;
  resources: BckndArgoCDRepositoryDetails[];
} & Record<string, any>;
