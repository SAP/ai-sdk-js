/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'GroundingFilterSearchConfiguration' schema.
 */
export type GroundingFilterSearchConfiguration = {
  /**
   * Maximum number of chunks to be returned. Cannot be used with 'maxDocumentCount'.
   */
  max_chunk_count?: number | null;
  /**
   * [Only supports 'vector' dataRepositoryType] - Maximum number of documents to be returned. Cannot be used with 'maxChunkCount'. If maxDocumentCount is given, then only one chunk per document is returned.
   */
  max_document_count?: number | null;
} | null;
