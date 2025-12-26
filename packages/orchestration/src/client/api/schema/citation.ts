/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'Citation' schema.
 */
export type Citation = {
  /**
   * Unique identifier for inline citation
   */
  ref_id?: number;
  /**
   * Title of the citation
   */
  title: string;
  /**
   * URL of the citation
   */
  url: string;
  /**
   * Start index of the citation in the response text
   */
  start_index?: number;
  /**
   * End index of the citation in the response text
   */
  end_index?: number;
} & Record<string, any>;
