/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Optional settings to control how fields are processed when using a configured Azure Search resource.
 */
export type AzureOpenAiAzureSearchIndexFieldMappingOptions = {
  /**
   * The name of the index field to use as a title.
   */
  title_field?: string;
  /**
   * The name of the index field to use as a URL.
   */
  url_field?: string;
  /**
   * The name of the index field to use as a filepath.
   */
  filepath_field?: string;
  /**
   * The names of index fields that should be treated as content.
   */
  content_fields?: string[];
  /**
   * The separator pattern that content fields should use.
   */
  content_fields_separator?: string;
  /**
   * The names of fields that represent vector data.
   */
  vector_fields?: string[];
} & Record<string, any>;
