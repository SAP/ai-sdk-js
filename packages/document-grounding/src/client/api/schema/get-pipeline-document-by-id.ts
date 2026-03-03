/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'GetPipelineDocumentById' schema.
 */
export type GetPipelineDocumentById = {
  /**
   * @example "uuid"
   */
  id?: string;
  /**
   * @example "location"
   */
  viewLocation?: string | null;
  /**
   * @example "location"
   */
  downloadLocation?: string | null;
  /**
   * @example "INDEXED"
   */
  status?: string;
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
