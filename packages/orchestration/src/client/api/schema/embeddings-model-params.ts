/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { EncodingFormat } from './encoding-format.js';
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
  encoding_format?: EncodingFormat | EncodingFormat[];
  normalize?: boolean;
} & Record<string, any>;
