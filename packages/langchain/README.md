# @sap-ai-sdk/LangChain

This package contains Langchain compliant models, based on the @sap-ai-sdk clients.

### Installation

```
$ npm install @sap-ai-sdk/langchain

$ npm install @langchain/openai // if you want to use OpenAI models
```

## Pre-requisites

- [Enable the AI Core service in BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/initial-setup).
- Ensure the project is configured with Node.js v20 or higher, along with native ESM support.

## Usage

All clients comply with [LangChain's interface](https://python.langchain.com/v0.2/api_reference/openai/chat_models/langchain_openai.chat_models.azure.AzureChatOpenAI.html#langchain_openai.chat_models.azure.AzureChatOpenAI).

To initialize the client, you can pass either:

```ts
    modelName: string,
    modelVersion?: string,
    resourceGroup?: string,
    ...others
```

or alternatively:

```ts
    deploymentId: string,
    resourceGroup?: string
    ...others
```

If you pass API keys, they are ignored, as it is not intended to call the vendor's endpoints directly.
Instead, the credentials in the binding are used to call SAP's LLM Proxy.

### OpenAI

We offer two types of clients for OpenAI models: chat and embedding.

All clients assume the same set of default values as [LangChain's default OpenAI client](https://www.npmjs.com/package/@langchain/openai) does.

#### Chat

There are two common APIs, `.invoke()` for simple text completion and `.generate()` for chat completion.
You can also combine them with the usual LangChain functionality, e.g. prompt templates.

A simple text completion might look like:

##### Initialization

```ts
import { OpenAiChatClient } from '@sap-ai-sdk/langchain';
const chatClient = new OpenAiChatClient({ modelName: 'gpt-4o' });
```

##### Usage

```ts
const response = await chatClient.invoke("What's the capital of France?'");
```

A chat completion example might be:

```ts
const response = await chatClient.generate([
  [new SystemMessage('You are an IT support agent answering questions.')],
  [new HumanMessage('Why is my internet not working?')]
]);
```

#### Embedding

You have the option to either embed a text or a document.
Documents have to be represented as an array of strings.

Below are two examples.

##### Initialization

```ts
import { OpenAiEmbeddingClient } from '@sap-ai-sdk/langchain';

const embeddingClient = new OpenAiEmbeddingClient({
  modelName: 'text-embedding-ada-002'
});
```

##### Usage

```ts
const embeddedText = await embeddingClient.embedQuery(
  'Paris is the capitol of France.'
);
```

```ts
const embeddedDocument = await embeddingClient.embedDocuments([
  'Page 1: Paris is the capitol of France.',
  'Page 2: It is a beautiful city.'
]);
```

## Support, Feedback, Contribution

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/)
