/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { EmbeddingsModelParams } from './embeddings-model-params.js';
/**
 * Representation of the 'EmbeddingsModelDetails' schema.
 */
export type EmbeddingsModelDetails = {
  name: string;
  /**
   * Default: "latest".
   */
  version?: string;
  params?: EmbeddingsModelParams;
};
