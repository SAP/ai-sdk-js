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
   * The number of dimensions the resulting output embeddings should have.
   *
   */
  dimensions?: number;
  /**
   * OpenAI's spec allows for 'float' and 'base64' encoding formats.
   *
   */
  encoding_format?: 'float' | 'base64' | 'binary';
  normalize?: boolean;
} & Record<string, any>;
