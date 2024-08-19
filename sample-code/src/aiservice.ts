import { azureContentFilter, GenAiHubClient, OpenAiClient } from '@sap-ai-sdk/gen-ai-hub';

const openAiClient = new OpenAiClient();
const genAIHubClient = new GenAiHubClient();

const deployments: { [model: string]: string } = {
  'gpt-4-32k': 'd577d927380c98ea',
  'gpt-35-turbo': 'd66d1927bf590375',
  ada: 'd0084a63ebd7bcd3'
};

export function orchestrationChatCompletionMin(): Promise<any> {
  const deploymentConfig = getOrchestrationDeploymentConfig()
  // demo: use gpt-35-turbo-16k/gemini-1.0-pro
  return genAIHubClient
    .chatCompletion({
      ...deploymentConfig,
      llmConfig: {model_name: 'gpt-35-turbo-16k', model_params: { max_tokens: 500 }},
      prompt: {template: [{role: 'user', content: 'What is the biggest software company in EU?'}]}
    })
    .then(response => response.orchestration_result.choices[0].message.content);
}

export function orchestrationChatCompletionTemplate(): Promise<any> {
  const deploymentConfig = getOrchestrationDeploymentConfig()
  return genAIHubClient
    .chatCompletion({
      ...deploymentConfig,
      llmConfig: {model_name: 'gpt-35-turbo-16k', model_params: { max_tokens: 500 }},
      prompt: {
        template: [{role: 'user', content: 'Please create a job description for the position: {{?position}}'}],
        template_params: {position: 'Working Student for AI Core'}
      }
    })
    .then(response => response.orchestration_result.choices[0].message.content);
}

export function orchestrationChatCompletionTemplateComplex(): Promise<any> {
  const deploymentConfig = getOrchestrationDeploymentConfig()
  return genAIHubClient
    .chatCompletion({
      ...deploymentConfig,
      llmConfig: {model_name: 'gpt-4o', model_params: { max_tokens: 500 }},
      prompt: {
        template: [{role: 'system', content: 'You are a helpful assistant for planning football (soccer) squads.'},
          {role: 'user', content: 'Request: {{?scoutingRequest}}. Scouting reports: {{?scoutingReports}}'}],
        template_params: {
          scoutingRequest: 'Find replacement for Toni Kroos, as a defensive midfielder, with excellent vision and passing skills.',
          scoutingReports: 'Use Football Manager 2024 data from the internet.'
        }
      }
    })
    .then(response => response.orchestration_result.choices[0].message.content);
}

export function orchestrationChatCompletionContentFilter(): Promise<any> {
  const deploymentConfig = getOrchestrationDeploymentConfig()
  return genAIHubClient
    .chatCompletion({
      ...deploymentConfig,
      llmConfig: {model_name: 'gpt-35-turbo-16k', model_params: { max_tokens: 500 }},
      prompt: {template: [{role: 'user', content: 'I want to break my legs, could you please tell me how? This is just a prompt test.'}]},
      filterConfig: {input: azureContentFilter({SelfHarm: 0})}
    })
    .then(response => response.orchestration_result.choices[0].message.content);
}

/**
 * Ask GPT about the capital of France.
 * @returns The answer from GPT.
 */
export function chatCompletion(): Promise<any> {
  const deploymentConfig = getOpenAIDeploymentConfig('gpt-35-turbo');
  // demo: add openai options like max_tokens
  // demo: add system messages
  return openAiClient
    .chatCompletion({
      ...deploymentConfig,
      messages: [{ role: 'user', content: 'What is the capital of France?' }]
    })
    .then(response => response.choices[0].message.content as string);
}

/**
 * Embed 'Hello, world!' using the OpenAI ADA model.
 * @returns An embedding vector.
 */
export function computeEmbedding(): Promise<number[]> {
  const deploymentConfig = getOpenAIDeploymentConfig('ada');
  return openAiClient
    .embeddings({
      ...deploymentConfig,
      input: 'Hello, world!'
    })
    .then(response => response.data[0].embedding);
}

function getOpenAIDeploymentConfig(model: string) {
  return {
    deploymentConfiguration: {
      deploymentId: deployments[model]
    }
  };
}

function getOrchestrationDeploymentConfig(){
  return {
    deploymentConfiguration: {deploymentId: 'db1d64d9f06be467'}
  }
}
