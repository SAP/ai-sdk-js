import { fileURLToPath } from 'url';
import path, { resolve } from 'path';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import {
  AzureOpenAiChatClient,
  AzureOpenAiEmbeddingClient
} from '@sap-ai-sdk/langchain';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { TextLoader } from 'langchain/document_loaders/fs/text';

/**
 * Ask GPT about the capital of France.
 * @returns The answer from GPT.
 */
export async function invoke(): Promise<string> {
  // initialize client with options
  const client = new AzureOpenAiChatClient({
    modelName: 'gpt-35-turbo',
    max_tokens: 1000,
    temperature: 0.7
  });

  // invoke a prompt
  const response = await client.invoke('What is the capital of France?');

  // create an output parser
  const parser = new StringOutputParser();

  // parse the response
  return parser.invoke(response);
}
/**
 * Ask GPT about the capital of France, as part of a chain.
 * @returns The answer from ChatGPT.
 */
export async function invokeChain(): Promise<string> {
  // initialize the client
  const client = new AzureOpenAiChatClient({ modelName: 'gpt-35-turbo' });

  // create a prompt template
  const promptTemplate = ChatPromptTemplate.fromMessages([
    ['system', 'Answer the following in {language}:'],
    ['user', '{text}']
  ]);
  // create an output parser
  const parser = new StringOutputParser();

  // chain together template, client, and parser
  const llmChain = promptTemplate.pipe(client).pipe(parser);

  // invoke the chain
  return llmChain.invoke({
    language: 'german',
    text: 'What is the capital of France?'
  });
}

/**
 * Invoke a request combined with an embedding.
 * @returns The answer from GPT.
 */
export async function invokeRagChain(): Promise<string> {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const resourcePath = resolve(__dirname, '../resources/orchestration.md');
  const loader = new TextLoader(resourcePath);

  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200
  });
  const embeddingClient = new AzureOpenAiEmbeddingClient({ modelName: 'text-embedding-ada-002', maxRetries: 0 });
  const splits = await textSplitter.splitDocuments(docs);
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splits,
    embeddingClient
  );

  const retriever = vectorStore.asRetriever();
  const promptTemplate = ChatPromptTemplate.fromTemplate(
    `You are an assistant for question-answering tasks.
      Use the following pieces of retrieved context to answer the question.
      If you don't know the answer, just say that you don't know.
      Use ten sentences maximum and keep the answer concise.
      Also prioritize code examples.

      Question: {question}
      Context: {context}
      Answer:`
  );
  const llm = new AzureOpenAiChatClient({ modelName: 'gpt-35-turbo', maxRetries: 0 });

  const ragChain = await createStuffDocumentsChain({
    llm,
    prompt: promptTemplate,
    outputParser: new StringOutputParser()
  });

  const prompt = 'How do you use templating in the SAP Orchestration client?';

  return ragChain.invoke({
    question: prompt,
    context: await retriever.invoke(prompt)
  });
}
