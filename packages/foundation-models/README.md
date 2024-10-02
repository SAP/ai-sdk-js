# @sap-ai-sdk/foundation-models

This package incorporates generative AI foundation models into your AI activities in SAP AI Core and SAP AI Launchpad.

## Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Relationship between Models and Deployment ID](#relationship-between-models-and-deployment-id)
- [Usage](#usage)
  - [Client Initialization](#client-initialization)
  - [Azure OpenAI Client](#azure-openai-client)
    - [Chat Client](#chat-client)
    - [Embedding Client](#embedding-client)
- [Local Testing](#local-testing)
- [Support, Feedback, Contribution](#support-feedback-contribution)
- [License](#license)

## Installation

```
$ npm install @sap-ai-sdk/foundation-models
```

## Prerequisites

- [Enable the AI Core service in BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/initial-setup).
- Project configured with Node.js v20 or higher and native ESM support enabled.
- A deployed OpenAI model in SAP Generative AI hub.
  - Use the [`DeploymentApi`](https://github.com/SAP/ai-sdk-js/blob/main/packages/ai-api/README.md#create-a-deployment) from `@sap-ai-sdk/ai-api` to deploy a model to SAP generative AI hub. 
  For more information, see [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-generative-ai-model-in-sap-ai-core).
    Deployment can be set up for each model and model version, as well as a resource group intended for use with the generative AI hub.
  - Once a deployment is complete, the model can be accessed via the `deploymentUrl`.

## Relationship between Models and Deployment ID

SAP AI Core manages access to generative AI models through the global AI scenario `foundation-models`.
Creating a deployment for a model requires access to this scenario.

Each model, model version, and resource group allows for a one-time deployment.
After deployment completion, the response includes a `deploymentUrl` and an `id`, which is the deployment ID. For more information, see [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-generative-ai-model-in-sap-ai-core).
[Resource groups](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/resource-groups?q=resource+group) represent a virtual collection of related resources within the scope of one SAP AI Core tenant.

Consequently, each deployment ID and resource group uniquely map to a combination of model and model version within the `foundation-models` scenario.

## Usage

### Client Initialization

You can pass the model name as a parameter to a client, the SDK will implicitly fetch the deployment ID for the model from the AI Core service and use it in the request.

By default, the SDK caches the deployment information, including the deployment ID, model name, and version, for 5 minutes to avoid performance issues from fetching this data with each request.

```ts
import {
  AzureOpenAiChatClient,
  AzureOpenAiEmbeddingClient
} from '@sap-ai-sdk/foundation-models';

// For a chat client
const chatClient = new AzureOpenAiChatClient({ modelName: 'gpt-4o' });
// For an embedding client
const embeddingClient = new AzureOpenAiEmbeddingClient({ modelName: 'gpt-4o' });
```

The deployment ID and resource group can be used as an alternative to the model name for obtaining a model.

```ts
const chatClient = new AzureOpenAiChatClient({
  deploymentId: 'd1234',
  resourceGroup: 'rg1234'
});
```

### Azure OpenAI Client

The Azure OpenAI client can then be used to send chat completion or embedding requests to models deployed in the SAP generative AI hub.

#### Chat Client

Use the `AzureOpenAiChatClient` to send chat completion requests to an OpenAI model deployed in SAP generative AI hub.

```ts
import { AzureOpenAiChatClient } from '@sap-ai-sdk/foundation-models';

const chatClient = new AzureOpenAiChatClient('gpt-4o');
const response = await chatClient.run({
  messages: [
    {
      role: 'user',
      content: 'Where is the deepest place on earth located'
    }
  ]
});

const responseContent = response.getContent();
```

Multiple messages can be sent in a single request, enabling the model to reference the conversation history.
Include parameters like `max_tokens` and `temperature` in the request to control the completion behavior:

```ts
const response = await chatClient.run({
  messages: [
    {
      role: 'system',
      content: 'You are a friendly chatbot.'
    },
    {
      role: 'user',
      content: 'Hi, my name is Isa'
    },
    {
      role: 'assistant',
      content:
        'Hi Isa! It is nice to meet you. Is there anything I can help you with today?'
    },
    {
      role: 'user',
      content: 'Can you remind me, What is my name?'
    }
  ],
  max_tokens: 100,
  temperature: 0.0
});

const responseContent = response.getContent();
const tokenUsage = response.getTokenUsage();

logger.info(
  `Total tokens consumed by the request: ${tokenUsage.total_tokens}\n` +
    `Input prompt tokens consumed: ${tokenUsage.prompt_tokens}\n` +
    `Output text completion tokens consumed: ${tokenUsage.completion_tokens}\n`
);
```

Refer to `AzureOpenAiChatCompletionParameters` interface for other parameters that can be passed to the chat completion request.

#### Embedding Client

Use the `AzureOpenAiEmbeddingClient` to send embedding requests to an OpenAI model deployed in SAP generative AI hub.

```ts
import { AzureOpenAiEmbeddingClient } from '@sap-ai-sdk/foundation-models';

const embeddingClient = new AzureOpenAiEmbeddingClient(
  'text-embedding-ada-002'
);
const response = await embeddingClient.run({
  input: 'AI is fascinating'
});
const embedding = response.getEmbedding();
```

## Local Testing

For local testing instuctions, refer to this [section](https://github.com/SAP/ai-sdk-js/blob/main/README.md#local-testing).

## Support, Feedback, Contribution

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/)
