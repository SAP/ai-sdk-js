/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Additional parameters for generating input's embeddings. Default values are used for mandatory parameters.
 */
export type EmbeddingsModelParams = {
  /**
   * The number of dimensions the resulting output embeddings should have.
   *
   */
  dimensions?: number;
  /**
   * The format to return the embeddings in. Can be a single format or an array of formats. OpenAI's spec allows for 'float' and 'base64' encoding formats.
   *
   */
  encoding_format?:
    | 'float'
    | 'base64'
    | 'binary'
    | 'int8'
    | 'uint8'
    | 'ubinary'
    | ('float' | 'base64' | 'binary' | 'int8' | 'uint8' | 'ubinary')[];
  normalize?: boolean;
} & Record<string, any>;
