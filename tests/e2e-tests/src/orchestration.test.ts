import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

// Pick .env file from root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

describe('orchestration', () => {
  it('should complete a chat', async () => {
    const response = await new OrchestrationClient({
      llmConfig: {
        model_name: 'gpt-35-turbo-16k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      templatingConfig: {
        template: [
          {
            role: 'user',
            content:
              'Create {{?number}} paraphrases of {{?phrase1}} and {{?phrase2}}'
          }
        ]
      }
    }).chatCompletion({
      inputParams: {
        number: '3',
        phrase1: 'I love coffee',
        phrase2: 'I dislike cats'
      }
    });

    expect(response.module_results).toBeDefined();
    expect(response.module_results.templating).not.toHaveLength(0);
    expect(response.module_results.templating?.[0].content).toBe(
      'Create 3 paraphrases of I love coffee and I dislike cats'
    );
    expect(response.orchestration_result.choices).not.toHaveLength(0);
  });
});
