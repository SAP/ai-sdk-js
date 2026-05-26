import { SapAzureOpenAI } from '@sap-ai-sdk/foundation-models-openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

/**
 * Ask gpt-5.4 about the capital of France.
 * @returns The content of the response message.
 */
export async function chatCompletion(): Promise<string | null> {
  const client = await SapAzureOpenAI.createClient({ modelDeployment: 'gpt-5.4' });
  const response = await client.chat.completions.create({
    messages: [{ role: 'user', content: 'What is the capital of France?' }]
  });

  return response.choices[0].message.content;
}

/**
 * Stream a chat completion from gpt-5.4.
 * @returns The stream of chat completion chunks.
 */
export async function chatCompletionStream(): Promise<
  AsyncIterable<{ choices: { delta: { content?: string | null } }[] }>
> {
  const client = await SapAzureOpenAI.createClient({ modelDeployment: 'gpt-5.4' });

  return client.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: 'Give me a short introduction of SAP Cloud SDK.'
      }
    ],
    stream: true
  });
}

/**
 * Embed 'Hello, world!' using text-embedding-3-small.
 * @returns The embedding vector for the input text.
 */
export async function computeEmbedding(): Promise<number[]> {
  const client = await SapAzureOpenAI.createClient({
    modelDeployment: 'text-embedding-3-small'
  });

  const response = await client.embeddings.create({
    input: 'Hello, world!'
  });

  return response.data[0].embedding;
}

/**
 * Use the Responses API to answer a question.
 * @returns The output text from the response.
 */
export async function responsesApi(): Promise<string | undefined> {
  const client = await SapAzureOpenAI.createClient({ modelDeployment: 'gpt-5.4' });

  const response = await client.responses.create({
    instructions: 'You are a helpful assistant.',
    input: 'What is the capital of France?'
  });

  return response.output_text;
}

/**
 * Stream a response using the Responses API.
 * @returns The stream of response events.
 */
export async function responsesApiStream(): Promise<
  AsyncIterable<{ type: string; delta?: string }>
> {
  const client = await SapAzureOpenAI.createClient({ modelDeployment: 'gpt-5.4' });

  return client.responses.create({
    instructions: 'You are a helpful assistant.',
    input: 'Give me a short introduction of SAP Cloud SDK.',
    stream: true
  });
}

const CapitalResponse = z.object({
  capital: z.string()
});

/**
 * Use structured output to parse the capital of France from gpt-5.4.
 * @returns The parsed capital city.
 */
export async function chatCompletionParse(): Promise<string | null> {
  const client = await SapAzureOpenAI.createClient({ modelDeployment: 'gpt-5.4' });

  const response = await client.chat.completions.parse({
    messages: [{ role: 'user', content: 'What is the capital of France?' }],
    response_format: zodResponseFormat(CapitalResponse, 'capital_response')
  });

  return response.choices[0].message.parsed?.capital ?? null;
}
