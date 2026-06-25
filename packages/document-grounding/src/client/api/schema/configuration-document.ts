/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { DocumentMetadata } from './document-metadata.js';
/**
 * Representation of the 'ConfigurationDocument' schema.
 */
export type ConfigurationDocument = {
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
   * Type of the resource. Can be FOLDER, DOCUMENT.
   * @example "FOLDER"
   */
  type?: 'FOLDER' | 'DOCUMENT' | any;
  /**
   * Metadata key-value pairs associated with the document.
   */
  metadata?: DocumentMetadata[];
} & Record<string, any>;
