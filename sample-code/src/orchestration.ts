import {
  CompletionPostResponse,
  OrchestrationClient
} from '@sap-ai-sdk/orchestration';

/**
 * Ask GPT about the capital of France.
 * @returns The answer from the orchestration service in Gen AI Hub.
 */
export async function orchestrationCompletion(): Promise<CompletionPostResponse> {
  const orchestrationClient = new OrchestrationClient({
    llm: {
      model_name: 'gpt-4-32k',
      model_params: {}
    },
    templating: {
      template: [{ role: 'user', content: 'What is the capital of France?' }]
    }
  });

  const response = await orchestrationClient.chatCompletion();
  return response.data;
}
