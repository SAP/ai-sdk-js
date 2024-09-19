# @sap-ai-sdk/foundation-models

This package incorporates generative AI foundation models into your AI activities in SAP AI Core and SAP AI Launchpad.

### Installation

```
$ npm install @sap-ai-sdk/foundation-models
```

## Pre-requisites

- [Enable the AI Core service in BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/initial-setup).
- Project configured with Node.js v20 or higher and native ESM support enabled.
- For testing your application locally:
  - Download a service key for your AI Core service instance.
  - Create a `.env` file in the sample-code directory.
  - Add an entry `AICORE_SERVICE_KEY='<content-of-service-key>'`.

## Azure OpenAI Client

To make a generative AI model available for use, you need to create a deployment.
You can create a deployment for each model and model version, as well as for each resource group that you want to use with generative AI hub.

After the deployment is complete, you have a `deploymentUrl`, which can be used to access the model.

The Azure OpenAI client allows you to send chat completion or embedding requests to OpenAI models deployed in SAP generative AI hub.

### Prerequisites

- A deployed OpenAI model in SAP generative AI hub.
  - You can use the [`DeploymentApi`](../ai-api/README.md#deploymentapi) from `@sap-ai-sdk/ai-api` to deploy a model to SAP generative AI hub. For more information, see [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-generative-ai-model-in-sap-ai-core).
- `sap-ai-sdk/foundation-models` package installed in your project.

### Usage of Azure OpenAI Chat Client

Use the `AzureOpenAiChatClient` to send chat completion requests to an OpenAI model deployed in SAP generative AI hub.
You can pass the model name as a parameter to the client, the SDK will implicitly fetch the deployment ID for the model from the AI Core service and use it to send the request.

The deployment information which includes deployment ID and properties like model name and model version is also cached by default for 5 mins so that performance is not impacted by fetching the deployment information for every request.

```TS
import { AzureOpenAiChatClient } from '@sap-ai-sdk/foundation-models';

const client = new AzureOpenAiChatClient('gpt-35-turbo');
const response = await client.run({
  messages: [
    {
      role: 'user',
      content: 'Where is the deepest place on earth located'
    }
  ]
});

const responseContent = response.getContent();

```

Use the following snippet to send a chat completion request with system messages:

```TS
import { AzureOpenAiChatClient } from '@sap-ai-sdk/foundation-models';

const client = new AzureOpenAiChatClient('gpt-35-turbo');
const response = await client.run({
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
      content: 'Hi Isa! It is nice to meet you. Is there anything I can help you with today?'
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

You can see that one can send multiple messages in a single request.
This is useful in providing a history of the conversation to the model.

Pass parameters like `max_tokens` and `temperature` to the request to control the completion behavior.
Refer to `AzureOpenAiChatCompletionParameters` interface for knowing more parameters that can be passed to the chat completion request.

#### Obtaining a client using Resource Groups

[Resource groups](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/resource-groups?q=resource+group) represent a virtual collection of related resources within the scope of one SAP AI Core tenant.

You can also obtain a model on your own by using a resource group and ID of your deployment instead of a model name:

```TS
import { AzureOpenAiChatClient } from '@sap-ai-sdk/foundation-models';

const response = await new AzureOpenAiChatClient({ deploymentId: 'd1234' , resourceGroup: 'rg1234' }).run({
  messages: [
    {
      'role':'user',
      'content': 'What is the capital of France?'
    }
  ]
});

```

### Usage of Azure OpenAI Embedding Client

Use the `AzureOpenAiEmbeddingClient` to send embedding requests to an OpenAI model deployed in SAP generative AI hub.
You can pass the model name as a parameter to the client, the sdk will implicitly fetch the deployment ID for the model from the AI Core service and use it to send the request.

The deployment information which includes deployment ID and properties like model name and model version is also cached by default for 5 mins so that performance is not impacted by fetching the deployment information for every request.

```TS
import { AzureOpenAiEmbeddingClient } from '@sap-ai-sdk/foundation-models';

const client = new AzureOpenAiEmbeddingClient('text-embedding-ada-002');
const response = await client.run({
  input: 'AI is fascinating'
});
const embedding = response.getEmbedding();

```

Like in [Azure OpenAI Chat client](#obtaining-a-client-using-resource-groups), you could also pass the [resource group](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/resource-groups?q=resource+group) name to the client along with the deployment ID instead of the model name.

```TS
const client = new AzureOpenAiEmbeddingClient({ deploymentId: 'd1234' , resourceGroup: 'rg1234' })
```

## Support, Feedback, Contribution

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/)
