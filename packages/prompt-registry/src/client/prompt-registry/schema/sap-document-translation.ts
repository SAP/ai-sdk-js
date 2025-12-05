/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'SAPDocumentTranslation' schema.
 */
export type SAPDocumentTranslation = {
  /**
   * Type of document translation provider
   * @example "sap_document_translation"
   */
  type: 'sap_document_translation';
  /**
   * Configuration for `sap_document_translation` translation provider.
   */
  config: {
    /**
     * Language of the text to be translated.
     * @example "de-DE"
     */
    source_language?: string;
    /**
     * Language to which the text should be translated.
     * @example "en-US"
     */
    target_language: string;
  };
};
