import { buildDpiMaskingProvider } from './masking.js';
import type { DpiConfig } from '../client/api/schema/index.js';

describe('masking util', () => {
  it('builds DPI masking provider with minimal parameters', () => {
    const expectedDpiMaskingProvider: DpiConfig = {
      type: 'sap_data_privacy_integration',
      method: 'anonymization',
      entities: [{ type: 'profile-address' }]
    };

    const actualDpiMaskingProvider = buildDpiMaskingProvider({
      method: 'anonymization',
      entities: ['profile-address']
    });

    expect(actualDpiMaskingProvider).toStrictEqual(expectedDpiMaskingProvider);
  });

  it('builds DPI masking provider with standard and custom entities', () => {
    const expectedDpiMaskingProvider: DpiConfig = {
      type: 'sap_data_privacy_integration',
      method: 'pseudonymization',
      entities: [
        {
          type: 'profile-address'
        },
        {
          type: 'profile-phone',
          replacement_strategy: {
            method: 'fabricated_data'
          }
        },
        {
          regex: '\\b[0-9]{4}-[0-9]{4}-[0-9]{3,5}\\b',
          replacement_strategy: {
            method: 'constant',
            value: 'REDACTED_ID'
          }
        }
      ],
      allowlist: ['SAP', 'Joule'],
      mask_grounding_input: {
        enabled: true
      }
    };

    const actualDpiMaskingProvider = buildDpiMaskingProvider({
      method: 'pseudonymization',
      entities: [
        'profile-address',
        {
          kind: 'standard-entity',
          type: 'profile-phone',
          replacement_strategy: {
            method: 'fabricated_data'
          }
        },
        {
          kind: 'custom-entity',
          regex: '\\b[0-9]{4}-[0-9]{4}-[0-9]{3,5}\\b',
          replacement_strategy: {
            method: 'constant',
            value: 'REDACTED_ID'
          }
        }
      ],
      allowlist: ['SAP', 'Joule'],
      mask_grounding_input: true
    });

    expect(actualDpiMaskingProvider).toStrictEqual(expectedDpiMaskingProvider);
  });
});
