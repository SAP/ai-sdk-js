/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'Embedding' schema.
 */
export type Embedding =
  | number[]
  | string
  | {
      /**
       * Float encoding format - array of floating point numbers
       */
      float?: number[];
      /**
       * Int8 encoding format - array of 8-bit integers
       */
      int8?: number[];
      /**
       * Uint8 encoding format - array of unsigned 8-bit integers
       */
      uint8?: number[];
      /**
       * Base64 encoding format - base64 encoded string
       */
      base64?: string;
      /**
       * Binary encoding format - as integers
       */
      binary?: number;
      /**
       * Ubinary encoding format - as unsigned integers
       */
      ubinary?: number;
    };
