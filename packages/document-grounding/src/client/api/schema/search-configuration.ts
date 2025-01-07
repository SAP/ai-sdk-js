/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'SearchConfiguration' schema.
 */
export type SearchConfiguration = {
  /**
   * Maximum number of chunks to be returned. Cannot be used with 'maxDocumentCount'.
   */
  maxChunkCount?: number;
  /**
   * [Only supports 'vector' dataRepositoryType] - Maximum number of documents to be returned. Cannot be used with 'maxChunkCount'. If maxDocumentCount is given, then only one chunk per document is returned.
   */
  maxDocumentCount?: number;
} & Record<string, any>;
