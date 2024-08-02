/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'BckndService' schema.
 */
export type BckndService = {
  /**
   * service name
   */
  name?: string;
  /**
   * service description
   */
  description?: string;
  /**
   * service broker url
   */
  url?: string;
  /**
   * aggregated status of the service
   */
  status?: 'PROVISIONED' | 'ERROR' | 'PROVISIONING' | 'DEPROVISIONING';
  /**
   * status message
   */
  statusMessage?: string;
} & Record<string, any>;
