/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'GroundingFilter' schema.
 */
export type GroundingFilter = {
  /**
   * @example "string"
   */
  id?: string;
  /**
   * @example {}
   */
  search_configuration?: Record<string, any>;
  /**
   * @example [
   *   "*"
   * ]
   */
  data_repositories?: string[];
  /**
   * @example "help.sap.com"
   */
  data_repository_type?: 'vector' | 'help.sap.com';
  /**
   * @example []
   */
  data_repository_metadata?: Record<string, any>[];
  /**
   * @example []
   */
  document_metadata?: Record<string, any>[];
  /**
   * @example []
   */
  chunk_metadata?: Record<string, any>[];
} & Record<string, any>;
