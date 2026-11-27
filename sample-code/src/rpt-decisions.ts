import { RptDecisionsClient } from '@sap-ai-sdk/rpt/decisions';

import type { SystemOneResponse } from '@sap-ai-sdk/rpt/decisions';

/**
 * Classify a code snippet as Java or JavaScript using labeled examples.
 * @param code - Code snippet to classify.
 * @returns The predicted programming language and its probabilities.
 */
export async function classifyProgrammingLanguage(
  code: string
): Promise<SystemOneResponse> {
  const client = new RptDecisionsClient('sap-rpt-decisions');
  return client.systemone({
    state: code,
    questions: {
      language: {
        type: 'choice',
        instructions: 'Which programming language is this code written in?',
        criteria: {
          Java: 'Java code with static types, classes and JVM APIs.',
          JavaScript:
            'JavaScript code with const, let, functions and browser or Node.js APIs.'
        }
      }
    },
    examples: [
      {
        state:
          'public class Hello { public static void main(String[] args) { System.out.println("Hello"); } }',
        answers: { language: 'Java' }
      },
      {
        state:
          'const greet = name => console.log("Hello " + name); greet("World");',
        answers: { language: 'JavaScript' }
      },
      {
        state:
          'import java.util.List; List<String> names = List.of("Ada", "Grace");',
        answers: { language: 'Java' }
      },
      {
        state:
          'const names = ["Ada", "Grace"]; names.forEach(name => console.log(name));',
        answers: { language: 'JavaScript' }
      }
    ]
  });
}
