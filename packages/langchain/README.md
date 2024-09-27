# @sap-ai-sdk/langchain

This package provides LangChain model clients built on top of the foundation model clients of the SAP Cloud SDK for AI.

## Table of Contents

1. [Installation](#installation)
2. [Prerequisites](#prerequisites)
3. [Usage](#usage)
   - [Client Initialization](#client-initialization)
   - [Chat Client](#chat-client)
   - [Embedding Client](#embedding-client)
4. [Support, Feedback, Contribution](#support-feedback-contribution)
5. [License](#license)

## Installation

```
$ npm install @sap-ai-sdk/langchain
```

## Prerequisites

- [Enable the AI Core service in SAP BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/initial-setup).
- Bind the service to your application.
- Ensure the project is configured with Node.js v20 or higher, along with native ESM support.
- For testing your application locally:
  - Download a service key for your AI Core service instance.
  - Create a `.env` file in the root of your directory.
  - Add an entry `AICORE_SERVICE_KEY='<content-of-service-key>'`.

## Usage

This package offers both chat and embedding clients, currently supporting Azure OpenAI.
All clients comply with [LangChain's interface](https://js.langchain.com/docs/introduction).

### Client Initialization

To initialize a client, provide the model name:

```ts
import {
  AzureOpenAiChatClient,
  AzureOpenAiEmbeddingClient
} from '@sap-ai-sdk/langchain';

// For a chat client
const chatClient = new AzureOpenAiChatClient({ modelName: 'gpt-4o' });
// For an embedding client
const embeddingClient = new AzureOpenAiEmbeddingClient({ modelName: 'gpt-4o' });
```

In addition to the default parameters of the model vendor (e.g., OpenAI) and LangChain, additional parameters can be used to help narrow down the search for the desired model:

```ts
const chatClient = new AzureOpenAiChatClient({
  modelName: 'gpt-4o',
  modelVersion: '24-07-2021',
  resourceGroup: 'my-resource-group'
});
```

An important note is that LangChain clients by default attempt 6 retries with exponential backoff in case of a failure.
Especially in testing environments you might want to reduce this number to speed up the process:

```ts
const embeddingClient = new AzureOpenAiEmbeddingClient({
  modelName: 'gpt-4o',
  maxRetries: 0
});
```

### Chat Client

The chat client allows you to interact with Azure OpenAI chat models, accessible via the generative AI hub of SAP AI Core.
To invoke the client, simply pass a prompt:

```ts
const response = await chatClient.invoke("What's the capital of France?");
```

#### Advanced Example with Templating and Output Parsing

```ts
import { AzureOpenAiChatClient } from '@sap-ai-sdk/langchain';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';

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
```

### Embedding Client

Embedding clients allow embedding either text or documents (represented as arrays of strings).
While you can use them standalone, they are usually used in combination with other LangChain utilities, like a text splitter for preprocessing and a vector store for storage and retrieval of the relevant embeddings.
For a complete example how to implement RAG with our LangChain client, take a look at our [sample code](https://github.com/SAP/ai-sdk-js/blob/main/sample-code/src/langchain-azure-openai.ts).

#### Embed Text

```ts
const embeddedText = await embeddingClient.embedQuery(
  'Paris is the capital of France.'
);
```

#### Embed Documents

```ts
const embeddedDocument = await embeddingClient.embedDocuments([
  'Page 1: Paris is the capital of France.',
  'Page 2: It is a beautiful city.'
]);
```

#### Preprocess, embed, and store documents

```ts
// Create a text splitter and split the document
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 2000,
  chunkOverlap: 200
});
const splits = await textSplitter.splitDocuments(docs);

// Initialize the embedding client
const embeddingClient = new AzureOpenAiEmbeddingClient({
  modelName: 'text-embedding-ada-002'
});

// Create a vector store from the document
const vectorStore = await MemoryVectorStore.fromDocuments(
  splits,
  embeddingClient
);

// Create a retriever for the vector store
const retriever = vectorStore.asRetriever();
```

## Support, Feedback, Contribution

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/).
