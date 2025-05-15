import { buildTranslationConfig } from './translation.js';
import type { SAPDocumentTranslation } from '../client/api/schema/index.js';

describe('Translation module config', () => {
  it('builds translation config', async () => {
    const translationConfig = buildTranslationConfig({
      source_language: 'de-DE',
      target_language: 'en-US'
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

  it('throw error when config is empty', async () => {
    expect(() => {
      buildTranslationConfig();
    }).toThrow('Target language is required for translation configuration.');
  });

  it('throw error when target language is empty', () => {
    expect(() => {
      buildTranslationConfig({
        source_language: 'en-US',
        target_language: ''
      });
    }).toThrow('Target language is required for translation configuration.');
  });
});
