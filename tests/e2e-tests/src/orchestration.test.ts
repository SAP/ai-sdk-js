import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

// Pick .env file from e2e root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

describe('orchestration', () => {
  it('should complete a chat', async () => {
    const response = await new OrchestrationClient({
      llm: {
        model_name: 'gpt-35-turbo-16k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      templating: {
        template: [
          {
            role: 'user',
            content: 'Create {{?number}} paraphrases of {{?phrase1}}'
          }
        ]
      }
    }).chatCompletion({
      inputParams: {
        number: '3',
        phrase1: 'I love coffee'
      }
    });

    const tokenUsage = response.getTokenUsage();

    console.log(
      `Total tokens consumed by the request: ${tokenUsage.total_tokens}\n` +
        `Input prompt tokens consumed: ${tokenUsage.prompt_tokens}\n` +
        `Output text completion tokens consumed: ${tokenUsage.completion_tokens}\n`
    );
    expect(response.data.module_results).toBeDefined();
    expect(response.data.module_results.templating).not.toHaveLength(0);
    expect(response.data.orchestration_result.choices).not.toHaveLength(0);
    expect(response.getContent()).toEqual(expect.any(String));
    expect(response.getFinishReason()).toEqual('stop');
  });
});
