import {
  GenAiHubClient,
  GenAiHubCompletionParameters
} from '@sap-ai-sdk/gen-ai-hub';
import 'dotenv/config';

describe('orchestration', () => {
  test.skip('should complete a chat, but currently doesn\'t work', async () => {
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
