import {
  buildAzureContentSafetyFilter,
  buildLlamaGuardFilter
} from './filtering.js';

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
  });

  describe('Llama Guard filter', () => {
    it('builds filter config with custom config', async () => {
      const filterConfig = buildLlamaGuardFilter('input', ['elections', 'hate']);
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
      const filterConfig = buildLlamaGuardFilter('output', [
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
});
