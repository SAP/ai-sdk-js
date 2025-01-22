/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BckndDeploymentQuota' schema.
 */
export type BckndDeploymentQuota = {
  /**
   * The value can be 0(disabled) or a positive integer defining the maximum allowed number
   * @example 10
   */
  maxCount?: number;
  maxReplicaPerDeployment?: number;
} & Record<string, any>;
