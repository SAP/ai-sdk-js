/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { AiArtifactArray } from './ai-artifact-array.js';
/**
 * Representation of the 'AiArtifactList' schema.
 */
export type AiArtifactList = {
  /**
   * Number of the resource instances in the list
   */
  count: number;
  resources: AiArtifactArray;
} & Record<string, any>;
