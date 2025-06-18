/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { Embedding } from './embedding.js';
/**
 * Represents an embedding vector returned by embedding endpoint.
 *
 */
export type EmbeddingResult = {
  /**
   * The object type, which is always "embedding".
   */
  object: 'embedding';
  embedding: Embedding;
  /**
   * The index of the embedding in the list of embeddings.
   */
  index: number;
};
