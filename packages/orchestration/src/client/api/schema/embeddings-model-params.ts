/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Additional parameters for generating input's embeddings. Default values are used for mandatory parameters.
 */
export type EmbeddingsModelParams = {
  /**
   * The number of dimensions the resulting output embeddings should have. Only supported in `text-embedding-3` and later models.
   *
   */
  dimensions?: number;
  /**
   * The format to return the embeddings in. It can be either `float` or `base64` for OpenAI models.
   *
   */
  encoding_format?: 'float' | 'base64' | 'binary';
  auto_truncate?: boolean;
  normalize?: boolean;
} & Record<string, any>;
