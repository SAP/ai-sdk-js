/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'PipelineDocumentResponse' schema.
 */
export type PipelineDocumentResponse = {
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
    | string;
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
} & Record<string, any>;
