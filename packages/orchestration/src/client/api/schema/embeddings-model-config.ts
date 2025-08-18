/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { EmbeddingsModelDetails } from './embeddings-model-details.js';
/**
 * Representation of the 'EmbeddingsModelConfig' schema.
 */
export type EmbeddingsModelConfig = {
  model: EmbeddingsModelDetails;
  /**
   * Timeout for the Embeddings request in seconds. This parameter will be ignored for Vertex AI models. Support for Vertex AI models will be added in the future.
   * Default: 600.
   * Maximum: 600.
   * Minimum: 1.
   */
  timeout?: number;
  /**
   * Maximum number of retries for the Embeddings request. This parameter will be ignored for Vertex AI models. Support for Vertex AI models will be added in the future.
   * Default: 2.
   * Maximum: 10.
   */
  max_retries?: number;
};
