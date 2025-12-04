import type { SAPDocumentTranslationApplyToSelector } from '../client/api/schema/index.js';
import type {
  TranslationConfigParams,
  TranslationReturnType,
  ConfigType,
  TranslationInputParameters,
  DocumentTranslationApplyToSelector
} from '../orchestration-types.js';

function mapSelectorToBaseType(
  selector: DocumentTranslationApplyToSelector
): SAPDocumentTranslationApplyToSelector {
  return {
    category: selector.category,
    items: selector.items,
    ...(selector.sourceLanguage && {
      source_language: selector.sourceLanguage
    })
  };
}

/**
 * Convenience function to build a document translation configuration for orchestration service.
 * @param type - Type of the translation configuration, either `input` or `output`.
 * @param config - Config for SAP Document Translation service.
 * The target language is mandatory, while source language will be auto-detected if not provided.
 * See https://help.sap.com/docs/translation-hub/sap-translation-hub/supported-languages-6854bbb1bd824ffebc3a097a7c0fd45d for list of supported languages.
 * @returns SAP Document Translation configuration.
 * @example buildTranslationConfig('input', { sourceLanguage: 'de-DE', targetLanguage: 'en-US' })
 * @example buildTranslationConfig('input', { sourceLanguage: 'de-DE', targetLanguage: 'en-US', translateMessagesHistory: false })
 * @example buildTranslationConfig('output', { targetLanguage: { category: 'placeholders', items: ['assistant_response'] } })
 */
export function buildTranslationConfig<T extends ConfigType>(
  type: T,
  config: TranslationConfigParams<T>
): TranslationReturnType<T> {
  if (type === 'input') {
    const inputConfig = config as TranslationInputParameters;
    return {
      type: 'sap_document_translation',
      ...(inputConfig.translateMessagesHistory !== undefined && {
        translate_messages_history: inputConfig.translateMessagesHistory
      }),
      config: {
        ...(inputConfig.sourceLanguage && {
          source_language: inputConfig.sourceLanguage
        }),
        target_language: inputConfig.targetLanguage,
        ...(inputConfig.applyTo && {
          apply_to: inputConfig.applyTo.map(mapSelectorToBaseType)
        })
      }
    } as TranslationReturnType<T>;
  }

  return {
    type: 'sap_document_translation',
    config: {
      ...(config.sourceLanguage && {
        source_language: config.sourceLanguage
      }),
      target_language:
        typeof config.targetLanguage === 'string'
          ? config.targetLanguage
          : mapSelectorToBaseType(config.targetLanguage)
    }
  } as TranslationReturnType<T>;
}
