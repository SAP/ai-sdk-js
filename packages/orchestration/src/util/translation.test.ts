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

  it('builds input translation config with translateMessagesHistory', async () => {
    const translationConfig = buildTranslationConfig('input', {
      sourceLanguage: 'de-DE',
      targetLanguage: 'en-US',
      translateMessagesHistory: true
    });

    const expectedTranslationConfig: SAPDocumentTranslationInput = {
      type: 'sap_document_translation',
      translate_messages_history: true,
      config: {
        source_language: 'de-DE',
        target_language: 'en-US'
      }
    };

    expect(translationConfig).toEqual(expectedTranslationConfig);
  });

  it('builds input translation config with applyTo', async () => {
    const translationConfig = buildTranslationConfig('input', {
      sourceLanguage: 'de-DE',
      targetLanguage: 'en-US',
      applyTo: [
        {
          category: 'placeholders',
          items: ['user_input'],
          sourceLanguage: 'de-DE'
        }
      ]
    });

    const expectedTranslationConfig: SAPDocumentTranslationInput = {
      type: 'sap_document_translation',
      config: {
        source_language: 'de-DE',
        apply_to: [
          {
            category: 'placeholders',
            items: ['user_input'],
            source_language: 'de-DE'
          }
        ],
        target_language: 'en-US'
      }
    };

    expect(translationConfig).toEqual(expectedTranslationConfig);
  });

  it('builds input translation config with all parameters', async () => {
    const translationConfig = buildTranslationConfig('input', {
      sourceLanguage: 'de-DE',
      targetLanguage: 'en-US',
      translateMessagesHistory: false,
      applyTo: [
        {
          category: 'template_roles',
          items: ['user', 'assistant']
        }
      ]
    });

    const expectedTranslationConfig: SAPDocumentTranslationInput = {
      type: 'sap_document_translation',
      translate_messages_history: false,
      config: {
        source_language: 'de-DE',
        target_language: 'en-US',
        apply_to: [
          {
            category: 'template_roles',
            items: ['user', 'assistant']
          }
        ]
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

  it('builds output translation config with applyTo selector as targetLanguage', async () => {
    const translationConfig = buildTranslationConfig('output', {
      targetLanguage: {
        category: 'placeholders',
        items: ['assistant_response']
      }
    });

    const expectedTranslationConfig: SAPDocumentTranslationOutput = {
      type: 'sap_document_translation',
      config: {
        target_language: {
          category: 'placeholders',
          items: ['assistant_response']
        }
      }
    };

    expect(translationConfig).toEqual(expectedTranslationConfig);
  });
});
