import {
  buildAzureContentSafetyFilter,
  buildGraniteGuardianFilter,
  buildLlamaGuard38BFilter
} from './filtering.ts';

describe('Content filter util', () => {
  describe('Azure content filter', () => {
    it('builds filter config', async () => {
      const filterConfig = buildAzureContentSafetyFilter('input', {
        hate: 'ALLOW_SAFE_LOW_MEDIUM',
        self_harm: 'ALLOW_SAFE'
      });
      const expectedFilterConfig = {
        type: 'azure_content_safety',
        config: {
          hate: 4,
          self_harm: 0
        }
      };
      expect(filterConfig).toEqual(expectedFilterConfig);
    });

    it('builds filter config with no config', async () => {
      const filterConfig = buildAzureContentSafetyFilter('input');
      const expectedFilterConfig = {
        type: 'azure_content_safety'
      };
      expect(filterConfig).toEqual(expectedFilterConfig);
    });

    it('throw error when configuring empty filter', async () => {
      expect(() => buildAzureContentSafetyFilter('input', {})).toThrow(
        'Filtering parameters cannot be empty'
      );
    });

    it('builds output filter config with protected_material_code', async () => {
      const filterConfig = buildAzureContentSafetyFilter('output', {
        hate: 'ALLOW_SAFE',
        protected_material_code: true
      });
      const expectedFilterConfig = {
        type: 'azure_content_safety',
        config: {
          hate: 0,
          protected_material_code: true
        }
      };
      expect(filterConfig).toEqual(expectedFilterConfig);
    });
  });

  describe('Llama Guard filter', () => {
    it('builds filter config with custom config', async () => {
      const filterConfig = buildLlamaGuard38BFilter('input', [
        'elections',
        'hate'
      ]);
      const expectedFilterConfig = {
        type: 'llama_guard_3_8b',
        config: {
          elections: true,
          hate: true
        }
      };
      expect(filterConfig).toEqual(expectedFilterConfig);
    });

    it('builds filter config without duplicates', async () => {
      const filterConfig = buildLlamaGuard38BFilter('output', [
        'non_violent_crimes',
        'privacy',
        'non_violent_crimes'
      ]);
      const expectedFilterConfig = {
        type: 'llama_guard_3_8b',
        config: {
          non_violent_crimes: true,
          privacy: true
        }
      };
      expect(filterConfig).toEqual(expectedFilterConfig);
    });
  });

  describe('Granite Guardian filter', () => {
    it('builds input filter config for a single category', async () => {
      const filterConfig = buildGraniteGuardianFilter('input', ['harm']);
      const expectedFilterConfig = {
        type: 'granite_guardian_4_1',
        config: {
          categories: {
            harm: true
          }
        }
      };
      expect(filterConfig).toEqual(expectedFilterConfig);
    });

    it('builds output filter config for multiple categories', async () => {
      const filterConfig = buildGraniteGuardianFilter('output', [
        'harm',
        'violence'
      ]);
      const expectedFilterConfig = {
        type: 'granite_guardian_4_1',
        config: {
          categories: {
            harm: true,
            violence: true
          }
        }
      };
      expect(filterConfig).toEqual(expectedFilterConfig);
    });

    it('builds filter config without duplicates', async () => {
      const filterConfig = buildGraniteGuardianFilter('input', [
        'harm',
        'social_bias',
        'harm'
      ]);
      const expectedFilterConfig = {
        type: 'granite_guardian_4_1',
        config: {
          categories: {
            harm: true,
            social_bias: true
          }
        }
      };
      expect(filterConfig).toEqual(expectedFilterConfig);
    });

    it('sets enable_reasoning when enableReasoning is true', async () => {
      const filterConfig = buildGraniteGuardianFilter('output', ['harm'], {
        enableReasoning: true
      });
      const expectedFilterConfig = {
        type: 'granite_guardian_4_1',
        config: {
          categories: {
            harm: true
          },
          enable_reasoning: true
        }
      };
      expect(filterConfig).toEqual(expectedFilterConfig);
    });

    it('omits enable_reasoning when not requested', async () => {
      const filterConfig = buildGraniteGuardianFilter('input', ['harm'], {
        enableReasoning: false
      });
      expect(filterConfig.config).not.toHaveProperty('enable_reasoning');
    });
  });
});
