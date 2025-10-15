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
  /**
   * Timeout for the Embeddings request in seconds. This parameter is currently ignored for Vertex AI models.
   * Default: 600.
   * Maximum: 600.
   * Minimum: 1.
   */
  timeout?: number;
  /**
   * Maximum number of retries for the Embeddings request. This parameter is currently ignored for Vertex AI models.
   * Default: 2.
   * Maximum: 5.
   */
  max_retries?: number;
};
