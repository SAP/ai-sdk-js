/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Response after deleting documents in bulk.
 */
export type DocumentBulkDeleteResponse = {
  /**
   * List of successfully deleted document IDs
   */
  deleted: string[];
  /**
   * List of document IDs that were not found
   */
  notFound: string[];
} & Record<string, any>;
