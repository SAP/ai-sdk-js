/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
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
  /**
   * @example "0 3 * * *"
   */
  cronExpression?: string;
} & Record<string, any>;
