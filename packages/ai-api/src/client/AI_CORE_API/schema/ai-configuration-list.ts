/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiConfiguration } from './ai-configuration.js';
/**
 * Representation of the 'AiConfigurationList' schema.
 */
export type AiConfigurationList = {
  /**
   * Number of the resource instances in the list
   */
  count: number;
  resources: AiConfiguration[];
} & Record<string, any>;
