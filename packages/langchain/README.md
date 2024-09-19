# @sap-ai-sdk/langchain

This package provides LangChain model clients, built on top of the foundation model clients of the SAP Cloud SDK for AI.

## Table of Contents

1. [Installation](#installation)
2. [Pre-requisites](#pre-requisites)
3. [Usage](#usage)
   - [Client Initialization](#client-initialization)
   - [Chat Clients](#chat-clients)
   - [Embedding Clients](#embedding-clients)
4. [Support, Feedback, Contribution](#support-feedback-contribution)
5. [License](#license)

## Installation

```
$ npm install @sap-ai-sdk/langchain
```

## Pre-requisites

- [Enable the AI Core service in SAP BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/initial-setup).
- Bind the service to your application.
- Ensure the project is configured with Node.js v20 or higher, along with native ESM support.
- For testing your application locally:
  - Download a service key for your AI Core service instance.
  - Create a `.env` file in the root of your directory.
  - Add an entry `AICORE_SERVICE_KEY='<content-of-service-key>'`.

## Usage

This package provides both chat and embedding clients, currently supporting Azure OpenAI.
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

In addition to the default parameters of the model vendor (e.g. OpenAI) and LangChain, there are additional parameters, which you can use to narrow down the search for the model you want to use:

```ts
const chatClient = new AzureOpenAiChatClient({
  modelName: 'gpt-4o',
  modelVersion: '24-07-2021',
  resourceGroup: 'my-resource-group'
});
```

### Chat Client

The chat clients allow you to interact with Azure OpenAI chat models, accessible via the generative AI hub of SAP AI Core.
To invoke the client, you only have a to pass a prompt:

```ts
const response = await chatClient.invoke("What's the capital of France?");
```

#### Advanced Example with Templating and Output Parsing

```ts
import { AzureOpenAiChatClient } from '@sap-ai-sdk/langchain';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const client = new AzureOpenAiChatClient({ modelName: 'gpt-35-turbo' });
const promptTemplate = ChatPromptTemplate.fromMessages([
  ['system', 'Answer the following in {language}:'],
  ['user', '{text}']
]);
const parser = new StringOutputParser();
const llmChain = promptTemplate.pipe(client).pipe(parser);
const response = await llmChain.invoke({
  language: 'german',
  text: 'What is the capital of France?'
});
```

### Embedding Client

Embedding clients allow embedding either text or documents (represented as arrays of strings).

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

## Support, Feedback, Contribution

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/).
