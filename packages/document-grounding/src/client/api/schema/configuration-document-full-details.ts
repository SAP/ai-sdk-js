/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DocumentMetadata } from './document-metadata.js';
/**
 * Representation of the 'ConfigurationDocumentFullDetails' schema.
 */
export type ConfigurationDocumentFullDetails = {
  /**
   * Unique identifier for the document.
   * @example "3cba7512-b07a-58e6-a442-c83996a0b3bb"
   */
  id?: string;
  /**
   * Title of the document.
   * @example "Quarterly Report"
   */
  title?: string;
  /**
   * Absolute file path of the document in the repository.
   * @example "/sites/team/finance/Q1/report.pdf"
   */
  absoluteFilePath?: string;
  /**
   * UTC timestamp when the document was created (RFC 3339 format, e.g., 2025-08-28T06:15:30Z)
   * @example "2025-08-28T06:15:30Z"
   * Format: "date-time".
   */
  createdTimestamp?: string;
  /**
   * URI of the resource.
   * @example "https://example.com/resource/123"
   */
  resourceUri?: string;
  /**
   * Web URL of the document.
   * @example "https://example.com/web/123"
   */
  webUrl?: string;
  /**
   * ETag of the document.
   * @example "abc123etag"
   */
  documentEtag?: string;
  /**
   * File suffix of the document.
   * @example ".pdf"
   */
  fileSuffix?: string;
  /**
   * View location of the document.
   * @example "https://example.com/view/123"
   */
  viewLocation?: string;
  /**
   * Download location of the document.
   * @example "https://example.com/download/123"
   */
  downloadLocation?: string;
  /**
   * MIME type of the document.
   * @example "application/pdf"
   */
  mimeType?: string;
  /**
   * File size of the document in megabytes.
   * @example "1.5"
   */
  fileSizeMb?: string;
  /**
   * Metadata key-value pairs associated with the document.
   */
  metadata?: DocumentMetadata[];
} & Record<string, any>;
