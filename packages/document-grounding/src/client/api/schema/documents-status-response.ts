/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'DocumentsStatusResponse' schema.
 */
export type DocumentsStatusResponse = {
  /**
   * @example 1
   */
  count?: number;
  resources?: ({
    /**
     * @example "uuid"
     */
    id?: string;
    /**
     * @example "INDEXED"
     */
    status?:
      | 'TO_BE_PROCESSED'
      | 'INDEXED'
      | 'REINDEXED'
      | 'DEINDEXED'
      | 'FAILED'
      | 'FAILED_TO_BE_RETRIED'
      | 'TO_BE_SCHEDULED'
      | any;
    /**
     * @example "location"
     */
    viewLocation?: string | null;
    /**
     * @example "location"
     */
    downloadLocation?: string | null;
    absoluteUrl?: string | null;
    title?: string | null;
    metadataId?: string | null;
    /**
     * @example "2024-02-15T12:45:00Z"
     */
    createdTimestamp?: string;
    /**
     * @example "2024-02-15T12:45:00Z"
     */
    lastUpdatedTimestamp?: string;
  } & Record<string, any>)[];
} & Record<string, any>;
