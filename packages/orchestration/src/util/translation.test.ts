import { buildTranslationConfig } from './translation.js';
import type { TranslationConfigParams } from '../orchestration-types.js';
import type { SAPDocumentTranslation } from '../client/api/schema/index.js';

describe('Translation module config', () => {
  it('builds translation config', async () => {
    const translationConfig = buildTranslationConfig({
      sourceLanguage: 'de-DE',
      targetLanguage: 'en-US'
    });

    const expectedTranslationConfig: SAPDocumentTranslation = {
      type: 'sap_document_translation',
      config: {
        source_language: 'de-DE',
        target_language: 'en-US'
      }
    };

    expect(translationConfig).toEqual(expectedTranslationConfig);
  });

  it('throws error when target language is empty', () => {
    const errorConfig: TranslationConfigParams = {
      sourceLanguage: 'en-US',
      targetLanguage: ''
    };
    expect(() => {
      buildTranslationConfig(errorConfig);
    }).toThrow('Target language is required for translation configuration.');
  });
});
