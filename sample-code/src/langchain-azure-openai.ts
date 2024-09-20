import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import {
  AzureOpenAiChatClient,
  AzureOpenAiEmbeddingClient
} from '@sap-ai-sdk/langchain';

/**
 * Ask GPT about the capital of France.
 * @returns The answer from GPT.
 */
export async function simpleInvoke(): Promise<string> {
  const client = new AzureOpenAiChatClient({ modelName: 'gpt-35-turbo' });
  const parser = new StringOutputParser();
  return client.pipe(parser).invoke('What is the capital of France?');
}

/**
 * Ask GPT about the capital of France, with a more complex prompt.
 * @returns The answer from GPT.
 */
export async function complexInvoke(): Promise<string> {
  const client = new AzureOpenAiChatClient({ modelName: 'gpt-35-turbo' });
  const promptTemplate = ChatPromptTemplate.fromMessages([
    ['system', 'Answer the following in {language}:'],
    ['user', '{text}']
  ]);
  const parser = new StringOutputParser();
  const llmChain = promptTemplate.pipe(client).pipe(parser);
  return llmChain.invoke({
    language: 'german',
    text: 'What is the capital of France?'
  });
}

/**
 * Embed 'Hello, world!' using the OpenAI ADA model.
 * @returns An embedding vector.
 */
export async function embedQuery(): Promise<number[]> {
  const client = new AzureOpenAiEmbeddingClient({
    modelName: 'text-embedding-ada-002'
  });
  return client.embedQuery('Hello, world!');
}

/**
 * Embed 'Hello, world!' and 'Goodbye, world!' using the OpenAI ADA model.
 * @returns An array of embedding vectors.
 */
export async function embedDocument(): Promise<number[][]> {
  const client = new AzureOpenAiEmbeddingClient({
    modelName: 'text-embedding-ada-002'
  });
  return client.embedDocuments(['Hello, world!', 'Goodbye, world!']);
}
