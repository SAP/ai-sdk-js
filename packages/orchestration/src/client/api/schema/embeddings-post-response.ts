/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ModuleResultsBase } from './module-results-base.js';
import type { EmbeddingsResponse } from './embeddings-response.js';
/**
 * Representation of the 'EmbeddingsPostResponse' schema.
 */
export type EmbeddingsPostResponse = {
  request_id: string;
  intermediate_results?: ModuleResultsBase;
  final_result?: EmbeddingsResponse;
};
