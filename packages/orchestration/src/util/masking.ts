
import type { DpiConfig } from '../client/api/schema/index.js';
import type { DpiMaskingConfig } from '../orchestration-types.js';

/**
 * Convenience function to create masking provider SAP Data Privacy Integration.
 * @param dpiMaskingConfig - Configuration for the masking provider SAP Data Privacy Integration.
 * @returns An object with the masking provider configuration.
 */
export function buildDpiMaskingProvider(dpiMaskingConfig: DpiMaskingConfig): DpiConfig {
  return {
    type: 'sap_data_privacy_integration',
    method: dpiMaskingConfig.method,
    entities: dpiMaskingConfig.entities.map(entity => ({
      type: entity
    })),
    ...(dpiMaskingConfig.mask_grounding_input !== undefined && {
      mask_grounding_input: {
        enabled: dpiMaskingConfig.mask_grounding_input
      }
    }),
    ...(dpiMaskingConfig.allowlist && {
      allowlist: dpiMaskingConfig.allowlist
    })
  };
}
