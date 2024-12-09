# @sap-ai-sdk/langchain

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package provides LangChain model clients built on top of the foundation model clients of the SAP Cloud SDK for AI.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Relationship between Models and Deployment ID](#relationship-between-models-and-deployment-id)
- [Usage](#usage)
  - [Client Initialization](#client-initialization)
  - [Chat Client](#chat-client)
  - [Embedding Client](#embedding-client)
- [Local Testing](#local-testing)
- [Support, Feedback, Contribution](#support-feedback-contribution)
- [License](#license)

## Installation

```
$ npm install @sap-ai-sdk/langchain
```

## Prerequisites

- [Enable the AI Core service in SAP BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/initial-setup).
- Use the same `@langchain/core` version as the `@sap-ai-sdk/langchain` package, to see which langchain version this package is currently using, check our [package.json](./package.json).
- Configure the project with **Node.js v20 or higher** and **native ESM** support.
- Ensure a deployed OpenAI model is available in the SAP Generative AI Hub.
  - Use the [`DeploymentApi`](https://github.com/SAP/ai-sdk-js/blob/main/packages/ai-api/README.md#create-a-deployment) from `@sap-ai-sdk/ai-api` [to deploy a model](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-generative-ai-model-in-sap-ai-core).
    Alternatively, you can also create deployments using the [SAP AI Launchpad](https://help.sap.com/docs/sap-ai-core/generative-ai-hub/activate-generative-ai-hub-for-sap-ai-launchpad?locale=en-US&q=launchpad).
  - Once deployment is complete, access the model via the `deploymentUrl`.

> **Accessing the AI Core Service via the SDK**
>
> The SDK automatically retrieves the `AI Core` service credentials and resolves the access token needed for authentication.
>
> - In Cloud Foundry, it's accessed from the `VCAP_SERVICES` environment variable.
> - In Kubernetes / Kyma environments, you have to mount the service binding as a secret instead, for more information refer to [this documentation](https://www.npmjs.com/package/@sap/xsenv#usage-in-kubernetes).

## Relationship between Models and Deployment ID

SAP AI Core manages access to generative AI models through the global AI scenario `foundation-models`.
Creating a deployment for a model requires access to this scenario.

Each model, model version, and resource group allows for a one-time deployment.
After deployment completion, the response includes a `deploymentUrl` and an `id`, which is the deployment ID.
For more information, see [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-generative-ai-model-in-sap-ai-core).

[Resource groups](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/resource-groups?q=resource+group) represent a virtual collection of related resources within the scope of one SAP AI Core tenant.

Consequently, each deployment ID and resource group uniquely map to a combination of model and model version within the `foundation-models` scenario.

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

**Do not pass a `deployment ID` to initialize the client.**
For the LangChain model clients, initialization is done using the model name, model version and resource group.

An important note is that LangChain clients by default attempt 6 retries with exponential backoff in case of a failure.
Especially in testing environments you might want to reduce this number to speed up the process:

```ts
const embeddingClient = new AzureOpenAiEmbeddingClient({
  modelName: 'gpt-4o',
  maxRetries: 0
});
```

#### Custom Destination

When initializing the `AzureOpenAiChatClient` and `AzureOpenAiEmbeddingClient` clients, it is possible to provide a custom destination.
For example, when targeting a destination with the name `my-destination`, the following code can be used:

```ts
const chatClient = new AzureOpenAiChatClient(
  {
    modelName: 'gpt-4o',
    modelVersion: '24-07-2021',
    resourceGroup: 'my-resource-group'
  },
  {
    destinatioName: 'my-destination'
  }
);
```

### Chat Client

The chat client allows you to interact with Azure OpenAI chat models, accessible via the generative AI hub of SAP AI Core.
To invoke the client, pass a prompt:

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

Embedding clients allow embedding either text or document chunks (represented as arrays of strings).
While you can use them standalone, they are usually used in combination with other LangChain utilities, like a text splitter for preprocessing and a vector store for storage and retrieval of the relevant embeddings.
For a complete example how to implement RAG with our LangChain client, take a look at our [sample code](https://github.com/SAP/ai-sdk-js/blob/main/sample-code/src/langchain-azure-openai.ts).

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

## Local Testing

For local testing instructions, refer to this [section](https://github.com/SAP/ai-sdk-js/blob/main/README.md#local-testing).

## Support, Feedback, Contribution

This project is open to feature requests, bug reports and questions via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome.
For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/).
