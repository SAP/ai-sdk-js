# LangChain Azure OpenAI Client

LangChain Azure OpenAI client utilizes `@sap-ai-sdk/foundation-models` package and provides an interface to interact with Azure OpenAI chat and embedding models when using LangChain.

> **Note**: For installation and prerequisites of the package `@sap-ai-sdk/langchain`, refer to the [README](../../README.md).

### Table of Contents

- [Relationship between Models and Deployment ID](#relationship-between-models-and-deployment-id)
- [Usage](#usage)
  - [Client Initialization](#client-initialization)
  - [Chat Client](#chat-client)
  - [Embedding Client](#embedding-client)
- [Local Testing](#local-testing)

## Relationship between Models and Deployment ID

SAP AI Core manages access to generative AI models through the global AI scenario `foundation-models`.
Creating a deployment for a model requires access to this scenario.

Each model, model version, and resource group allows for a one-time deployment.
After deployment completion, the response includes a `deploymentUrl` and an `id`, which is the deployment ID.
For more information, see [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-generative-ai-model-in-sap-ai-core).

[Resource groups](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/resource-groups?q=resource+group) represent a virtual collection of related resources within the scope of one SAP AI Core tenant.

Consequently, each deployment ID and resource group uniquely map to a combination of model and model version within the `foundation-models` scenario.

## Usage

This package offers both chat and embedding clients for Azure OpenAI.
The client complies with [LangChain's interface](https://js.langchain.com/docs/introduction).

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
const embeddingClient = new AzureOpenAiEmbeddingClient({
  modelName: 'text-embedding-3-small'
});
```

In addition to the default parameters of Azure OpenAI and LangChain, additional parameters can be used to help narrow down the search for the desired model:

```ts
const chatClient = new AzureOpenAiChatClient({
  modelName: 'gpt-4o',
  modelVersion: '2024-08-06',
  resourceGroup: 'my-resource-group'
});
```

**Do not pass `deployment ID` when initializing the client.**

#### Resilience

To add resilience to the client, use LangChain's default options, especially `timeout` and `maxRetry`.

##### Timeout

By default, no timeout is set in the client.
To limit the maximum duration for the entire request, including retries, specify a timeout in milliseconds when using the `invoke` method:

```ts
const response = await client.invoke(messageHistory, { timeout: 10000 });
```

##### Retry

LangChain clients retry up to 6 times by default.
To modify this behavior, set the `maxRetries` option during client initialization:

```ts
const client = new AzureOpenAiChatClient(
  { modelName: 'gpt-4o' },
  {
    maxRetries: 0
  }
);
```

#### Custom Destination

When initializing the `AzureOpenAiChatClient` and `AzureOpenAiEmbeddingClient`, a custom destination can be specified.
For example, to target `my-destination`, use the following code:

```ts
const chatClient = new AzureOpenAiChatClient(
  {
    modelName: 'gpt-4o',
    modelVersion: '2024-08-06',
    resourceGroup: 'my-resource-group'
  },
  {
    destinationName: 'my-destination'
  }
);
```

By default, the fetched destination is cached.
To disable caching, set the `useCache` parameter to `false` together with the `destinationName` parameter.

### Chat Client

The `AzureOpenAiChatClient` allows interaction with Azure OpenAI chat models, accessible through the Generative AI Hub of SAP AI Core.
To invoke the client, pass a prompt as shown below:

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

The `AzureOpenAiEmbeddingClient` allows embedding of text or document chunks (represented as arrays of strings).
While it can be used standalone, it is typically combined with other LangChain utilities, such as a text splitter for preprocessing and a vector store for storing and retrieving relevant embeddings.
For a complete example of how to implement RAG with the LangChain client, refer to the [sample code](https://github.com/SAP/ai-sdk-js/blob/main/sample-code/src/langchain-azure-openai.ts).

#### Embed Text

```ts
const embeddedText = await embeddingClient.embedQuery(
  'Paris is the capital of France.'
);
```

#### Embed Document Chunks

```ts
const embeddedDocuments = await embeddingClient.embedDocuments([
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
  modelName: 'text-embedding-3-small'
});

// Create a vector store from the document
const vectorStore = await MemoryVectorStore.fromDocuments(
  splits,
  embeddingClient
);

// Create a retriever for the vector store
const retriever = vectorStore.asRetriever();
```

## Local Testing

For local testing instructions, refer to this [section](https://github.com/SAP/ai-sdk-js/blob/main/README.md#local-testing).
