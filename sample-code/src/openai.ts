import { SapOpenAi } from '@sap-ai-sdk/openai';
import { zodResponseFormat, zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';

/**
 * Ask gpt-5.4 about the capital of France.
 * @returns The content of the response message.
 */
export async function chatCompletion(): Promise<string | null> {
  const client = await SapOpenAi.createClient({
    deployment: 'gpt-5.4'
  });
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
  const client = await SapOpenAi.createClient('gpt-5.4-nano');

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
 * Use structured output to parse the capital of France from gpt-5.4.
 * @returns The parsed capital city.
 */
export async function chatCompletionParse(): Promise<string | null> {
  const client = await SapOpenAi.createClient({
    deployment: 'gpt-5.4-nano'
  });

  const response = await client.chat.completions.parse({
    messages: [{ role: 'user', content: 'What is the capital of France?' }],
    response_format: zodResponseFormat(CapitalResponse, 'capital_response')
  });

  return response.choices[0].message.parsed?.capital ?? null;
}

/**
 * Ask gpt-5.4 about the capital of France.
 * @returns The content of the response message.
 */
export async function chatCompletionPerRequestModel(): Promise<string | null> {
  const client = await SapOpenAi.createClient({
    deployment: 'gpt-5.4'
  });
  const response = await client.chat.completions.create({
    model: 'gpt-5.4-nano',
    messages: [{ role: 'user', content: 'What is the capital of France?' }]
  });

  return response.choices[0].message.content;
}

/**
 * Embed 'Hello, world!' using text-embedding-3-small.
 * @returns The embedding vector for the input text.
 */
export async function computeEmbedding(): Promise<number[]> {
  const client = await SapOpenAi.createClient({
    deployment: 'text-embedding-3-small'
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
  const client = await SapOpenAi.createClient('gpt-5.4-nano');

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
  const client = await SapOpenAi.createClient('gpt-5.4-nano');

  return client.responses.create({
    instructions: 'You are a helpful assistant.',
    input: 'Give me a short introduction of SAP Cloud SDK.',
    stream: true
  });
}

/**
 * Use the Responses API in a stateful multi-turn conversation using previous_response_id.
 * @returns The follow-up response text, continuing from the first response.
 */
export async function responsesApiStateful(): Promise<string | undefined> {
  const client = await SapOpenAi.createClient({
    deployment: 'gpt-5.4-nano'
  });

  const first = await client.responses.create({
    instructions: 'You are a helpful assistant.',
    input: 'What is the capital of France?'
  });

  const second = await client.responses.create({
    previous_response_id: first.id,
    input: 'What is the population of that city?'
  });

  return second.output_text;
}

/**
 * Use the Responses API in a multi-turn conversation by manually managing context.
 * @returns The follow-up response text.
 */
export async function responsesApiMultiTurn(): Promise<string | undefined> {
  const client = await SapOpenAi.createClient({
    deployment: 'gpt-5.4-nano'
  });

  let context: any[] = [
    { role: 'user', content: 'What is the capital of France?' }
  ];

  const first = await client.responses.create({ input: context });

  context = context.concat(first.output);
  context.push({
    role: 'user',
    content: 'What is the population of that city?'
  });

  const second = await client.responses.create({ input: context });

  return second.output_text;
}

const CapitalResponse = z.object({
  capital: z.string()
});

/**
 * Use structured output to parse the capital of France from the Responses API.
 * @returns The parsed capital city.
 */
export async function responsesApiParse(): Promise<string | null> {
  const client = await SapOpenAi.createClient('gpt-5.4-nano');

  const response = await client.responses.parse({
    instructions: 'You are a helpful assistant.',
    input: 'What is the capital of France?',
    text: { format: zodTextFormat(CapitalResponse, 'capital_response') }
  });

  return response.output_parsed?.capital ?? null;
}
