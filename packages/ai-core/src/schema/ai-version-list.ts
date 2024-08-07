/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiVersion } from './ai-version.js';
/**
 * Representation of the 'AiVersionList' schema.
 */
export type AiVersionList = {
  /**
   * Number of the resource instances in the list
   */
  count: number;
  resources: AiVersion[];
} & Record<string, any>;
