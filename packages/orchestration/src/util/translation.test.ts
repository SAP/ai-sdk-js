import { buildOrchestrationTranslationModule } from './translation.js';
import type { SAPDocumentTranslation } from '../client/api/schema/index.js';
import type { TranslationConfigParams } from '../orchestration-types.js';

describe('Translation module config', () => {
  it('builds translation config', async () => {
    const translationConfig = buildOrchestrationTranslationModule({
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
      buildOrchestrationTranslationModule();
    }).toThrow('Target language is required for translation configuration.');
  });

  it('throw error when target language is empty', () => {
    const invalidConfig: TranslationConfigParams = {
      target_language: ' '
    };

    expect(() => {
      buildOrchestrationTranslationModule(invalidConfig);
    }).toThrow('Target language is required for translation configuration.');
  });
});
