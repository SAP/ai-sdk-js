# @sap-ai-sdk/langchain

This package provides LangChain model clients built on top of the foundation model clients of the SAP Cloud SDK for AI.

## Table of Contents

1. [Installation](#installation)
2. [Prerequisites](#prerequisites)
3. [Relationship between Models and Deployment ID](#relationship-between-models-and-deployment-id)
4. [Usage](#usage)
   - [Client Initialization](#client-initialization)
   - [Chat Client](#chat-client)
   - [Embedding Client](#embedding-client)
5. [Local Testing](#local-testing)
6. [Support, Feedback, Contribution](#support-feedback-contribution)
7. [License](#license)

## Installation

```
$ npm install @sap-ai-sdk/langchain
```

## Prerequisites

- [Enable the AI Core service in SAP BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/initial-setup).
- Bind the service to your application you are building.
- Ensure the project is configured with Node.js v20 or higher, along with native ESM support.
- A deployed model is available in SAP Generative AI hub.
  - Use the [`DeploymentApi`](../ai-api/README.md#deploymentapi) from `@sap-ai-sdk/ai-api` to deploy a model to SAP generative AI hub. For more information, see [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-generative-ai-model-in-sap-ai-core).
    Deployment can be set up for each model and model version, as well as a resource group intended for use with the generative AI hub.
  - Once a deployment is complete, the model can be accessed via the `deploymentUrl`.

## Relationship between Models and Deployment ID

Access to generative AI models is provided under the global AI scenario `foundation-models`, which is managed by SAP AI Core.
You can create a deployment for a model, only if you have access to the global AI scenario `foundation-models`.
Each model, model version, and resource group allows for a one-time deployment.
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

## Local Testing

For local testing, refer to [here](../../README.md#local-testing).

## Support, Feedback, Contribution

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/).
