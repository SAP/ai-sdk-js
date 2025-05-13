import type { SAPDocumentTranslation } from '../client/api/schema/index.js';
import type { TranslationConfigParams } from '../orchestration-types.js';

/**
 * Convenience function to build a document translation configuration for orchestration service.
 * @param config - Config for SAP Document Translation service.
 * The target language is mandatory, while source language will be auto-detected if not provided.
 * See https://help.sap.com/docs/translation-hub/sap-translation-hub/supported-languages-6854bbb1bd824ffebc3a097a7c0fd45d?state=DRAFT for list of supported languages.
 * @returns A `SAPDocumentTranslation` configuration object.
 * @example "buildOrchestrationTranslationModule({source_language: 'de-DE', target_language: 'en-US'})"
 */
export function buildOrchestrationTranslationModule(
  config?: TranslationConfigParams
): SAPDocumentTranslation {
  if (!config || !config.target_language || !config.target_language.trim()) {
    throw new Error(
      'Target language is required for translation configuration.'
    );
  }

  return {
    type: 'sap_document_translation',
    config: {
      ...(config.source_language && {
        source_language: config.source_language
      }),
      target_language: config.target_language
    }
  };
}
