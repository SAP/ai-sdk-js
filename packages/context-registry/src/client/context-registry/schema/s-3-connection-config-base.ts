/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'S3ConnectionConfigBase' schema.
 */
export type S3ConnectionConfigBase = {
  /**
   * S3 bucket name
   * Min Length: 1.
   */
  bucket?: string;
  /**
   * AWS region (e.g. eu-central-1)
   * Min Length: 1.
   */
  region?: string;
  /**
   * AWS access key ID
   * Min Length: 1.
   */
  access_key_id?: string;
  /**
   * AWS secret access key (raw value — must not be URL-encoded)
   * Min Length: 1.
   */
  secret_access_key?: string;
};
