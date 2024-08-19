import {
  type CompletionPostResponse,
  GenAiHubClient
} from '@sap-ai-sdk/gen-ai-hub';

/**
 * Ask GPT about the capital of France.
 * @returns The answer from the orchestration service in Gen AI Hub.
 */
export function orchestrationCompletion(): Promise<CompletionPostResponse> {
  const genAiHubClient = new GenAiHubClient();

  return genAiHubClient.chatCompletion({
    deploymentConfiguration: { deploymentId: 'db1d64d9f06be467' },
    llmConfig: {
      model_name: 'gpt-4-32k',
      model_params: {}
    },
    prompt: {
      template: [{ role: 'user', content: 'What is the capital of France?' }]
    }
  });
}
