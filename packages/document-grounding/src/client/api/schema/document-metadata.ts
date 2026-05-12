/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'DocumentMetadata' schema.
 */
export type DocumentMetadata = {
  /**
   * Metadata key name.
   * @example "contentObjectId"
   */
  key: string;
  /**
   * An array of string values associated with the metadata key. If the key already exists, its values will be overwritten. Setting the value to null will delete the metadata key-value pair.
   */
  value: string[] | null;
  /**
   * Match mode for the metadata key (ANY or ALL).
   * @example "ANY"
   */
  matchMode?: 'ANY' | 'ALL' | any;
} & Record<string, any>;
