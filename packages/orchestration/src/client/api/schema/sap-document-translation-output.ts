/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { SAPDocumentTranslationOutputTargetLanguage } from './sap-document-translation-output-target-language.js';
/**
 * Representation of the 'SAPDocumentTranslationOutput' schema.
 */
export type SAPDocumentTranslationOutput = {
  /**
   * Configuration for `sap_document_translation` translation provider.
   * @example "sap_document_translation"
   */
  type: 'sap_document_translation';
  config: {
    /**
     * Language of the text to be translated.
     * @example "de-DE"
     */
    source_language?: string;
    target_language: SAPDocumentTranslationOutputTargetLanguage;
  };
};
