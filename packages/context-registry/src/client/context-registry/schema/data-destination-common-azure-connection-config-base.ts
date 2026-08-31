/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'DataDestinationCommonAzureConnectionConfigBase' schema.
 */
export type DataDestinationCommonAzureConnectionConfigBase = {
  /**
   * Azure storage account name (maps to user= in HANA credential)
   * Min Length: 1.
   */
  account_name?: string;
  /**
   * Full container URI from the BTP Object Store service key (e.g. https://account.z2.blob.storage.azure.net/container). TCR strips the https:// prefix to derive the HANA adls endpoint.
   *
   * Min Length: 1.
   */
  container_uri?: string;
  /**
   * SAS token (raw, percent-encoded characters stored as-is).  Must grant read + list (r + l) on the container.
   * Min Length: 1.
   */
  sas_token?: string;
};
