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
import {
  HumanMessage,
  SystemMessage,
  ToolMessage
} from '@langchain/core/messages';
// eslint-disable-next-line import/no-internal-modules
import * as z from 'zod/v4';
import { tool } from '@langchain/core/tools';
import type { AIMessageChunk, BaseMessage } from '@langchain/core/messages';

/**
 * Ask GPT about the capital of France.
 * @returns The answer from GPT.
 */
export async function invoke(): Promise<string> {
  // initialize client with options
  const client = new AzureOpenAiChatClient({
    modelName: 'gpt-4o',
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
  const client = new AzureOpenAiChatClient({ modelName: 'gpt-4o' });

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
 * Perform retrieval augmented generation with the chat and embedding LangChain clients.
 * @returns The answer from GPT.
 */
export async function invokeRagChain(): Promise<string> {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const resourcePath = resolve(__dirname, '../resources/orchestration.md');

  // Create a text loader and load the document
  const loader = new TextLoader(resourcePath);
  const docs = await loader.load();

  // Create a text splitter and split the document
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200
  });
  const splits = await textSplitter.splitDocuments(docs);

  // Initialize the embedding client with 0 retries for fast testing
  const embeddingClient = new AzureOpenAiEmbeddingClient({
    modelName: 'text-embedding-3-small',
    maxRetries: 0
  });

  // Create a vector store from the document
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splits,
    embeddingClient
  );

  // Create a prompt template
  const promptTemplate = ChatPromptTemplate.fromTemplate(
    `You are an assistant for question-answering tasks.
      Use the following pieces of retrieved context to answer the question.
      If you don't know the answer, just say that you don't know.
      Use ten sentences maximum and keep the answer concise.
      Always include code snippets in your answer including class instantiation.

      Question: {question}
      Context: {context}
      Answer:`
  );

  // Initialize the chat client with 0 retries for fast testing
  const llm = new AzureOpenAiChatClient({
    modelName: 'gpt-4o',
    maxRetries: 0
  });

  // Create a chain to combine an LLM call with the prompt template and output parser
  const ragChain = await createStuffDocumentsChain({
    llm,
    prompt: promptTemplate,
    outputParser: new StringOutputParser()
  });

  // Create a retriever for the vector store
  const retriever = vectorStore.asRetriever();

  // Create a prompt
  const prompt = 'How do you use templating in the SAP Orchestration client?';

  // Invoke the chat client combined with the prompt, prompt template, output parser and vector store context
  return ragChain.invoke({
    question: prompt,
    context: await retriever.invoke(prompt)
  });
}

/**
 * Let GPT increase the shareholder value.
 * @returns The answer from GPT.
 */
export async function invokeToolChain(): Promise<string> {
  // initialize client with options
  const client = new AzureOpenAiChatClient({
    modelName: 'gpt-4o',
    max_tokens: 1000,
    temperature: 0.7
  });

  // create a function to increase the shareholder value
  function shareholderValueFunction(value: number): string {
    return `The shareholder value has been increased to ${value * 2}`;
  }

  // create a tool
  const shareholderValueTool = tool(shareholderValueFunction, {
    name: 'shareholder_value',
    description: 'Multiplies the shareholder value',
    schema: z.object({
      value: z.number().describe('The value that is supposed to be increased.')
    })
  });

  const messages: BaseMessage[] = [
    new HumanMessage('Increase the shareholder value, it is currently at 10')
  ];

  const response = await client
    .bindTools([shareholderValueTool])
    .invoke(messages);

  messages.push(response);

  if (
    Array.isArray(response.tool_calls) &&
    response.tool_calls[0].name === 'shareholder_value'
  ) {
    const shareholderValue = shareholderValueFunction(
      response.tool_calls[0].args.value
    );

    const toolMessage = new ToolMessage({
      content: shareholderValue,
      tool_call_id: response.tool_calls[0].id ?? 'default'
    });

    messages.push(toolMessage);
  } else {
    const failMessage = new SystemMessage(
      'Shareholder value tool was not called'
    );
    messages.push(failMessage);
  }

  const finalResponse = await client.invoke(messages);

  // create an output parser
  const parser = new StringOutputParser();

  // parse the response
  return parser.invoke(finalResponse);
}

/**
 * Stream responses using LangChain Orchestration client.
 * @param controller - The abort controller to cancel the request if needed.
 * @returns An async iterable of {@link AIMessageChunk} objects.
 */
export async function streamChain(
  controller = new AbortController()
): Promise<AsyncIterable<AIMessageChunk>> {
  const client = new AzureOpenAiChatClient({
    modelName: 'gpt-4o'
  });
  return client.stream(
    [
      {
        role: 'user',
        content:
          'Write a 100 word explanation about SAP Cloud SDK and its capabilities'
      }
    ],
    {
      signal: controller.signal
    }
  );
}
