import type {
  TranslationConfig,
  TranslationParameters
} from '../orchestration-types.js';

/**
 * Convenience function to build a document translation configuration for orchestration service.
 * @param type - Type of the translation, either 'input' or 'output'.
 * @param config - Config for SAP Document Translation service.
 * The target language is mandatory, while source language will be auto-detected if not provided.
 * See https://help.sap.com/docs/translation-hub/sap-translation-hub/supported-languages-6854bbb1bd824ffebc3a097a7c0fd45d for list of supported languages.
 * @returns A `SAPDocumentTranslation` configuration object.
 * @example "buildTranslationConfig('input', { sourceLanguage: 'de-DE', targetLanguage: 'en-US' })"
 */
export function buildTranslationConfig<T extends 'input' | 'output'>(
  type: T,
  config: TranslationParameters<T>
): TranslationConfig {
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
