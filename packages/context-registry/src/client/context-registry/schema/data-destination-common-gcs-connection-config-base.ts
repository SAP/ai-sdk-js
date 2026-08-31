/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'DataDestinationCommonGCSConnectionConfigBase' schema.
 */
export type DataDestinationCommonGCSConnectionConfigBase = {
  /**
   * GCS bucket name
   * Min Length: 1.
   */
  bucket?: string;
  /**
   * Base64-encoded service account JSON key, as provided directly in the BTP Object Store service key. TCR decodes this at runtime to extract client_email and private_key for the HANA OAUTH credential. The decoded value must be valid JSON containing both client_email and private_key fields.
   *
   * Format: "byte".
   * Min Length: 1.
   */
  base64_encoded_private_key_data?: string;
};
