import type { TranslationConfigParams } from '../orchestration-types.js';
import type { SAPDocumentTranslation } from '../client/api/schema/index.js';

/**
 * Convenience function to build a document translation configuration for orchestration service.
 * @param config - Config for SAP Document Translation service.
 * The target language is mandatory, while source language will be auto-detected if not provided.
 * See https://help.sap.com/docs/translation-hub/sap-translation-hub/supported-languages-6854bbb1bd824ffebc3a097a7c0fd45d for list of supported languages.
 * @returns A `SAPDocumentTranslation` configuration object.
 * @example "buildTranslationConfig({ sourceLanguage: 'de-DE', targetLanguage: 'en-US' })"
 */
export function buildTranslationConfig(
  config?: TranslationConfigParams
): SAPDocumentTranslation {
  if (!config?.targetLanguage) {
    throw new Error(
      'Target language is required for translation configuration.'
    );
  }

  return {
    type: 'sap_document_translation',
    config: {
      ...(config.sourceLanguage && {
        source_language: config.sourceLanguage
      }),
      target_language: config.targetLanguage
    }
  };
}
