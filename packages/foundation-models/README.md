# @sap-ai-sdk/foundation-models

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package incorporates generative AI foundation models into your AI activities in SAP AI Core and SAP AI Launchpad.

### Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Relationship between Models and Deployment ID](#relationship-between-models-and-deployment-id)
- [Usage](#usage)
  - [Azure OpenAI Client Initialization](#azure-openai-client-initialization)
  - [Azure OpenAI Chat Client](#azure-openai-chat-client)
  - [Azure OpenAI Embedding Client](#azure-openai-embedding-client)
  - [Custom Request Configuration](#custom-request-configuration)
  - [Custom Destination](#custom-destination)
- [Local Testing](#local-testing)
- [Support, Feedback, Contribution](#support-feedback-contribution)
- [License](#license)

## Installation

```
$ npm install @sap-ai-sdk/foundation-models
```

## Prerequisites

- [Enable the AI Core service in SAP BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/initial-setup).
- Configure the project with **Node.js v20 or higher** and **native ESM** support.
- Ensure a deployed OpenAI model is available in the SAP Generative AI Hub.
  - Use the [`DeploymentApi`](https://github.com/SAP/ai-sdk-js/blob/main/packages/ai-api/README.md#create-a-deployment) from `@sap-ai-sdk/ai-api` [to deploy a model](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-generative-ai-model-in-sap-ai-core).
    Alternatively, you can also create deployments using the [SAP AI Launchpad](https://help.sap.com/docs/sap-ai-core/generative-ai-hub/activate-generative-ai-hub-for-sap-ai-launchpad?locale=en-US&q=launchpad).
    Deployment can be set up for each model and model version, as well as a resource group.
  - Once a deployment is complete, access the model via the `deploymentUrl`.

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

### Azure OpenAI Client Initialization

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

### Azure OpenAI Chat Client

#### Making Requests

Use the `AzureOpenAiChatClient` to send chat completion requests to an OpenAI model deployed in SAP generative AI hub.

The client sends request with Azure OpenAI API version `2024-06-01`.

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

console.log(
  `Total tokens consumed by the request: ${tokenUsage.total_tokens}\n` +
    `Input prompt tokens consumed: ${tokenUsage.prompt_tokens}\n` +
    `Output text completion tokens consumed: ${tokenUsage.completion_tokens}\n`
);
```

Refer to `AzureOpenAiChatCompletionParameters` interface for other parameters that can be passed to the chat completion request.

#### Streaming

The `AzureOpenAiChatClient` supports streaming response for chat completion requests based on the [Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events) standard.

Use the `stream()` method to receive a stream of chunk responses from the model.
After consuming the stream, call the helper methods to get the finish reason and token usage information respectively.

```ts
const chatClient = new AzureOpenAiChatClient('gpt-4o');
const response = await chatClient.stream({
  messages: [
    {
      role: 'user',
      content: 'Give me a very long introduction of SAP Cloud SDK.'
    }
  ]
});

for await (const chunk of response.stream) {
  console.log(JSON.stringify(chunk));
}

const finishReason = response.getFinishReason();
const tokenUsage = response.getTokenUsage();

console.log(`Finish reason: ${finishReason}\n`);
console.log(`Token usage: ${JSON.stringify(tokenUsage)}\n`);
```

##### Streaming the Delta Content

The client provides a helper method to extract delta content and stream string directly.

```ts
for await (const chunk of response.stream.toContentStream()) {
  console.log(chunk); // will log the delta content
}
```

Each chunk will be a defined string containing the delta content.
Set `choiceIndex` parameter for `toContentStream()` method to stream a specific choice.

##### Streaming with Abort Controller

Streaming request can be aborted using the `AbortController` API.
In case of an error, the SAP Cloud SDK for AI will automatically close the stream.
Additionally, it can be aborted manually by calling the `stream()` method with an `AbortController` object.

```ts
const chatClient = new AzureOpenAiChatClient('gpt-4o');
const controller = new AbortController();
const response = await new AzureOpenAiChatClient('gpt-35-turbo').stream(
  {
    messages: [
      {
        role: 'user',
        content: 'Give me a very long introduction of SAP Cloud SDK.'
      }
    ]
  },
  controller
);

// Abort the streaming request after one second
setTimeout(() => {
  controller.abort();
}, 1000);

for await (const chunk of response.stream) {
  console.log(JSON.stringify(chunk));
}
```

In this example, streaming request will be aborted after one second.
Abort controller can be useful, e.g., when end-user wants to stop the stream or refreshes the page.

### Azure OpenAI Embedding Client

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

### Custom Request Configuration

Set custom request configuration in the `requestConfig` parameter when calling the `run()` method of a chat or embedding client.

```ts
const response = await client.run(
  {
    ...
  },
  {
    headers: {
      'x-custom-header': 'custom-value'
      // Add more headers here
    },
    params: {
      // Add more parameters here
    }
    // Add more request configuration here
  }
);
```

### Custom Destination

When initializing the `AzureOpenAiChatClient` and `AzureOpenAiEmbeddingClient` clients, it is possible to provide a custom destination.
For example, when targeting a destination with the name `my-destination`, the following code can be used:

```ts
const client = await new AzureOpenAiChatClient('gpt-35-turbo', {
  destinationName: 'my-destination'
});
```

By default, the fetched destination is cached.
To disable caching, set the `useCache` parameter to `false` together with the `destinationName` parameter.

## Local Testing

For local testing instructions, refer to this [section](https://github.com/SAP/ai-sdk-js/blob/main/README.md#local-testing).

## Support, Feedback, Contribution

This project is open to feature requests, bug reports and questions via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome.
For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/)
