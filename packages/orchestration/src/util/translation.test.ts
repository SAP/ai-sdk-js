import { buildTranslationConfig } from './translation.js';
import type {
  SAPDocumentTranslationInput,
  SAPDocumentTranslationOutput
} from '../client/api/schema/index.js';

describe('Translation module config', () => {
  it('builds input translation config', async () => {
    const translationConfig = buildTranslationConfig('input', {
      sourceLanguage: 'de-DE',
      targetLanguage: 'en-US'
    });

    const expectedTranslationConfig: SAPDocumentTranslationInput = {
      type: 'sap_document_translation',
      config: {
        source_language: 'de-DE',
        target_language: 'en-US'
      }
    };

    expect(translationConfig).toEqual(expectedTranslationConfig);
  });

  it('builds output translation config', async () => {
    const translationConfig = buildTranslationConfig('output', {
      sourceLanguage: 'de-DE',
      targetLanguage: 'en-US'
    });

    const expectedTranslationConfig: SAPDocumentTranslationOutput = {
      type: 'sap_document_translation',
      config: {
        source_language: 'de-DE',
        target_language: 'en-US'
      }
    };

    expect(translationConfig).toEqual(expectedTranslationConfig);
  });
});
