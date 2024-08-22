import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  GenAiHubClient,
  GenAiHubCompletionParameters
} from '@sap-ai-sdk/gen-ai-hub';

// Pick .env file from root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

describe('orchestration', () => {
  it('should complete a chat', async () => {
    const request: GenAiHubCompletionParameters = {
      deploymentConfiguration: { deploymentId: 'db1d64d9f06be467' },
      llmConfig: {
        model_name: 'gpt-35-turbo-16k',
        model_params: { max_tokens: 50, temperature: 0.1 }
      },
      prompt: {
        template: [{ role: 'user', content: 'Hello!' }]
      }
    };
    const response = await new GenAiHubClient().chatCompletion(request);

    expect(response.module_results).toBeDefined();
    expect(response.orchestration_result.choices).not.toHaveLength(0);
  });
});
