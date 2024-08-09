/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'GroundingFilter' schema.
 */
export type GroundingFilter = {
  id?: string;
  search_configuration?: Record<string, any>;
  data_repositories?: string[];
  data_repository_type?: 'vector' | 'help.sap.com';
  data_repository_metadata?: Record<string, any>[];
  document_metadata?: Record<string, any>[];
  chunk_metadata?: Record<string, any>[];
} & Record<string, any>;
