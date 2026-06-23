/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { ConfigurationDocumentFullDetails } from './configuration-document-full-details.js';
/**
 * Representation of the 'ListConfigurationDocumentsFullDetails' schema.
 */
export type ListConfigurationDocumentsFullDetails = {
  /**
   * Total number of documents returned.
   * @example 1
   */
  count?: number;
  /**
   * List of document objects. It will be empty array if no records found.
   */
  resources?: ConfigurationDocumentFullDetails[];
} & Record<string, any>;
