/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { SAPDocumentTranslationApplyToSelector } from './sap-document-translation-apply-to-selector.js';
/**
 * Representation of the 'SAPDocumentTranslationInput' schema.
 */
export type SAPDocumentTranslationInput = {
  /**
   * Type of document translation provider
   * @example "sap_document_translation"
   */
  type: 'sap_document_translation';
  /**
   * If true, the messages history will be translated as well.
   * Default: true.
   */
  translate_messages_history?: boolean;
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
     * Min Items: 1.
     */
    apply_to?: SAPDocumentTranslationApplyToSelector[];
    /**
     * Language to which the text should be translated.
     * @example "en-US"
     */
    target_language: string;
  };
};
