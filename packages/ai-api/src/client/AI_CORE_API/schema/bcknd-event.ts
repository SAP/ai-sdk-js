/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BckndEvent' schema.
 */
export type BckndEvent = {
  /**
   * tenant id
   */
  tenantId?: string;
  action?: 'PROVISION' | 'DEPROVISION';
  state?: 'SUCCESSFUL' | 'FAILED' | 'PENDING';
  /**
   * describes the event state
   */
  description?: string;
  /**
   * @example "2017-09-28T08:56:23.275Z"
   * Format: "date-time".
   */
  createdAt?: string;
} & Record<string, any>;
