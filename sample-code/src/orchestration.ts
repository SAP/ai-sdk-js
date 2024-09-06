import {
  OrchestrationClient,
  CompletionPostResponse
} from '@sap-ai-sdk/gen-ai-hub';

/**
 * Ask GPT about the capital of France.
 * @returns The answer from the orchestration service in Gen AI Hub.
 */
export async function orchestrationCompletion(): Promise<CompletionPostResponse> {
  const orchestrationClient = new OrchestrationClient({
    llmConfig: {
      model_name: 'gpt-4-32k',
      model_params: {}
    },
    templatingConfig: {
      template: [{ role: 'user', content: 'What is the capital of France?' }]
    }
  });

  const response = await orchestrationClient.chatCompletion();
  return response.data;
}
