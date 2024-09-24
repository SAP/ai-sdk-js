import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import {
  AzureOpenAiChatClient,
  AzureOpenAiEmbeddingClient
} from '@sap-ai-sdk/langchain';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

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
 * Invoke a request combined with an embedding.
 * @returns The answer from GPT.
 */
export async function ragInvoke(): Promise<string> {
  const loader = new CheerioWebBaseLoader(
    'https://github.com/SAP/ai-sdk-js/blob/main/packages/orchestration/README.md'
  );

  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  });
  const splits = await textSplitter.splitDocuments(docs);
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splits,
    new AzureOpenAiEmbeddingClient({ modelName: 'text-embedding-3-large' })
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
  const llm = new AzureOpenAiChatClient({ modelName: 'gpt-3.5-turbo' });

  const ragChain = await createStuffDocumentsChain({
    llm,
    prompt: promptTemplate,
    outputParser: new StringOutputParser()
  });

  const prompt = 'How do you use the SAP Orchestration client?';

  return ragChain.invoke({
    question: prompt,
    context: await retriever.invoke(prompt)
  });
}
