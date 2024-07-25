/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ProviderType } from './provider-type.js';
/**
 * Representation of the 'Filter' schema.
 */
export type Filter = {
  /**
   * Type of filtering service provider.
   */
  type: ProviderType;
  /**
   * Filters classifiers to be used.
   */
  config?: Record<string, any>;
} & Record<string, any>;
