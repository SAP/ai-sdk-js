import {
  type CompletionPostResponse,
  OrchestrationClient
} from '@sap-ai-sdk/gen-ai-hub';

/**
 * Ask GPT about the capital of France.
 * @returns The answer from the orchestration service in Gen AI Hub.
 */
export async function orchestrationCompletion(): Promise<CompletionPostResponse> {
  const orchestrationClient = new OrchestrationClient();

  const response = await orchestrationClient.chatCompletion(
    {
      llmConfig: {
        model_name: 'gpt-4-32k',
        model_params: {}
      },
      prompt: {
        template: [{ role: 'user', content: 'What is the capital of France?' }]
      }
    },
    'db1d64d9f06be467'
  );
  return response.data;
}
