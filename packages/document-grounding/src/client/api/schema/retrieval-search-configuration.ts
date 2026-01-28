/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'RetrievalSearchConfiguration' schema.
 * Default: {}.
 */
export type RetrievalSearchConfiguration =
  | ({
      /**
       * Maximum number of chunks to be returned. Cannot be used with 'maxDocumentCount'.
       * Maximum: 10000000.
       */
      maxChunkCount?: number | null;
      /**
       * [Only supports 'vector' dataRepositoryType] - Maximum number of documents to be returned. Cannot be used with 'maxChunkCount'. If maxDocumentCount is given, then only one chunk per document is returned.
       * Maximum: 10000000.
       */
      maxDocumentCount?: number | null;
    } & Record<string, any>)
  | null;
