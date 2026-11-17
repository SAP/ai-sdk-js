import { createOpenAiConfig } from '@sap-ai-sdk/openai';

import { tool } from '@langchain/core/tools';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { createAgent } from 'langchain';
import * as z from 'zod/v4';

import type { AIMessageChunk } from '@langchain/core/messages';
import type { IterableReadableStream } from '@langchain/core/utils/stream';
import type { ChatOpenAIFields, ClientOptions } from '@langchain/openai';

/**
 * Map the `AzureOpenAI` options created by `@sap-ai-sdk/openai` to the `ClientOptions` expected by `@langchain/openai`.
 * `ChatOpenAI` and `OpenAIEmbeddings` use the deployment URL as base URL, send the SAP AI Core token as bearer token, and add the `api-version` query parameter.
 * @param deployment - The model name of the SAP AI Core deployment.
 * @returns Client options for `@langchain/openai` models.
 */
async function createLangChainOpenAiConfig(
  deployment: string
): Promise<ClientOptions> {
  const { baseURL, apiVersion, azureADTokenProvider, defaultHeaders } =
    await createOpenAiConfig({
      deployment,
      clientType: 'sample-code-langchain-openai'
    });

  return {
    baseURL,
    apiKey: azureADTokenProvider,
    defaultQuery: { 'api-version': apiVersion },
    defaultHeaders
  };
}

/**
 * Create a LangChain `ChatOpenAI` model for a SAP AI Core deployment.
 * @param deployment - The model name of the SAP AI Core deployment.
 * @param fields - Additional `ChatOpenAI` fields.
 * @returns The LangChain chat model.
 */
async function createChatOpenAi(
  deployment: string,
  fields: Omit<ChatOpenAIFields, 'configuration'> = {}
): Promise<ChatOpenAI> {
  return new ChatOpenAI({
    model: deployment,
    ...fields,
    configuration: await createLangChainOpenAiConfig(deployment)
  });
}

/**
 * Ask GPT about the capital of France using the Chat Completions API.
 * @returns The answer from GPT.
 */
export async function invokeChatOpenAi(): Promise<string> {
  const model = await createChatOpenAi('gpt-5.4-nano', { maxTokens: 1000 });

  const response = await model.invoke('What is the capital of France?');
  return response.text;
}

/**
 * Ask GPT about the capital of France using the Responses API.
 * @returns The answer from GPT.
 */
export async function invokeChatOpenAiResponses(): Promise<string> {
  const model = await createChatOpenAi('gpt-5.4-nano', {
    useResponsesApi: true
  });

  const response = await model.invoke('What is the capital of France?');
  return response.text;
}

/**
 * Stream a response from GPT using the Chat Completions API.
 * @param controller - The abort controller to cancel the stream.
 * @returns A stream of message chunks.
 */
export async function streamChatOpenAi(
  controller = new AbortController()
): Promise<IterableReadableStream<AIMessageChunk>> {
  const model = await createChatOpenAi('gpt-5.4-nano', { streamUsage: true });

  return model.stream('Give me a short introduction of SAP Cloud SDK.', {
    signal: controller.signal
  });
}

/**
 * Let a LangChain agent use a tool to answer a question.
 * @returns The final answer of the agent.
 */
export async function invokeChatOpenAiAgent(): Promise<string> {
  const model = await createChatOpenAi('gpt-5.4', { useResponsesApi: true });
  const getWeather = tool(
    ({ city }) => `The weather in ${city} is sunny and 21 degrees Celsius.`,
    {
      name: 'get_weather',
      description: 'Get the current weather for a city.',
      schema: z.object({ city: z.string() })
    }
  );

  const agent = createAgent({ model, tools: [getWeather] });
  const result = await agent.invoke({
    messages: [{ role: 'user', content: 'What is the weather in Paris?' }]
  });

  return result.messages.at(-1)?.text ?? '';
}

const capitalSchema = z.object({
  city: z.string().describe('The capital city.'),
  country: z.string().describe('The country of the capital city.')
});

/**
 * Get a response matching a schema using the Responses API.
 * @returns The structured response.
 */
export async function invokeChatOpenAiStructuredOutput(): Promise<
  z.infer<typeof capitalSchema>
> {
  const model = await createChatOpenAi('gpt-5.4-nano', {
    useResponsesApi: true
  });

  return model
    .withStructuredOutput(capitalSchema, { name: 'capital', strict: true })
    .invoke('What is the capital of France?');
}

/**
 * Use a reasoning model with low reasoning effort using the Responses API.
 * @returns The answer from the reasoning model.
 */
export async function invokeChatOpenAiReasoning(): Promise<string> {
  const model = await createChatOpenAi('gpt-5.4', {
    useResponsesApi: true,
    reasoning: { effort: 'low' }
  });

  const response = await model.invoke(
    'Which city is the capital of France? Answer in one sentence.'
  );
  return response.text;
}

/**
 * Embed a text using the LangChain `OpenAIEmbeddings` model.
 * @returns The embedding vector.
 */
export async function embedQueryOpenAi(): Promise<number[]> {
  const deployment = 'text-embedding-3-small';
  const embeddings = new OpenAIEmbeddings({
    model: deployment,
    configuration: await createLangChainOpenAiConfig(deployment)
  });

  return embeddings.embedQuery('Hello, world!');
}
