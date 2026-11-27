import { classifyProgrammingLanguage } from '@sap-ai-sdk/sample-code';

import { loadEnv } from './utils/load-env.ts';

loadEnv();

describe('rpt decisions', () => {
  it.each([
    {
      language: 'Java',
      code: 'public class Calculator { public int add(int a, int b) { return a + b; } }'
    },
    {
      language: 'JavaScript',
      code: 'const add = (a, b) => a + b; console.log(add(2, 3));'
    }
  ])('should classify $language code', async ({ language, code }) => {
    const response = await classifyProgrammingLanguage(code);
    const answer = response.answers.language;
    expect(answer.type).toBe('choice');
    if (answer.type !== 'choice') {
      throw new Error('Expected a choice answer for the programming language.');
    }
    expect(answer.choice).toBe(language);
    expect(answer.confidence).toBeGreaterThanOrEqual(0);
    expect(answer.confidence).toBeLessThanOrEqual(1);
    expect(answer.probabilities.Java).toBeGreaterThanOrEqual(0);
    expect(answer.probabilities.JavaScript).toBeGreaterThanOrEqual(0);
    expect(
      answer.probabilities.Java + answer.probabilities.JavaScript
    ).toBeCloseTo(1);
  });
});
