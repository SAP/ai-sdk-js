/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'PresignedUrlRequest' schema.
 */
export type PresignedUrlRequest = {
  /**
   * Expiration time in seconds for the presigned URL (600–604800). If omitted, the destination's presign_expiration_secs setting is used.
   * @example 3600
   * Maximum: 604800.
   * Minimum: 600.
   */
  expirationSecs?: number;
} & Record<string, any>;
