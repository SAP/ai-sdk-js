/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { SharePointConfig } from './share-point-config.js';
/**
 * Representation of the 'MSSharePointConfiguration' schema.
 */
export type MSSharePointConfiguration = {
  /**
   * @example "generic-secret-name"
   */
  destination: string;
  sharePoint: SharePointConfig;
} & Record<string, any>;
