import type { DpiConfig } from '../client/api/schema/index.js';
import type { DpiMaskingConfig } from '../orchestration-types.js';

/**
 * Convenience function to create masking provider SAP Data Privacy Integration.
 * @param dpiMaskingConfig - Configuration for the masking provider SAP Data Privacy Integration.
 * @returns An object with the masking provider configuration.
 */
export function buildDpiMaskingProvider(
  dpiMaskingConfig: DpiMaskingConfig
): DpiConfig {
  const { method, mask_grounding_input, entities, allowlist } =
    dpiMaskingConfig;
  return {
    type: 'sap_data_privacy_integration',
    method,
    entities: entities.map(entity => {
      if (typeof entity === 'string') {
        return { type: entity };
      }
      return entity.type === 'custom'
        ? (({ type: _, ...rest }) => rest)(entity)
        : entity;
    }),
    ...(mask_grounding_input !== undefined && {
      mask_grounding_input: {
        enabled: mask_grounding_input
      }
    }),
    ...(allowlist && {
      allowlist
    })
  };
}
