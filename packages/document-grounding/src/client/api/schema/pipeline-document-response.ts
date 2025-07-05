/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DocumentStatus } from './document-status.js';
/**
 * Representation of the 'PipelineDocumentResponse' schema.
 */
export type PipelineDocumentResponse = {
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
   * @example "2024-02-15T12:45:00Z"
   */
  lastUpdatedTimestamp?: string;
  status?: DocumentStatus;
} & Record<string, any>;
