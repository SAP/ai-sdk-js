# @sap-ai-sdk/langchain

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package provides LangChain model clients built on top of the foundation model clients of the SAP Cloud SDK for AI.

> **Note**: For installation and prerequisites, refer to the [README](../../README.md).

### Table of Contents

- [Usage](#usage)
  - [Client Initialization](#client-initialization)
  - [Client](#client)
    - [Resilience](#resilience)
- [Local Testing](#local-testing)
- [Limitations](#limitations)

## Usage

This package offers a LangChain orchestration service client.
Streaming is not supported.
The client complies with [LangChain's interface](https://js.langchain.com/docs/introduction).

### Client Initialization

To initialize the client, four different configurations can be provided.
The only required configuration is the orchestration configuration, explained in detail in the [orchestration foundation client](https://github.com/SAP/ai-sdk-js/blob/main/packages/orchestration/README.md).  
Additionally, it is possible to set [default LangChain options](https://v03.api.js.langchain.com/types/_langchain_core.language_models_chat_models.BaseChatModelParams.html), a custom resource group, and a destination.

A minimal example for instantiating the orchestration client uses a template and model name:

```ts
import { OrchestrationClient } from '@sap-ai-sdk/langchain';
const config: OrchestrationModuleConfig = {
  llm: {
    model_name: 'gpt-35-turbo'
  },
  templating: {
    template: [
      { role: 'user', content: 'Give me a long introduction of {{?subject}}' }
    ]
  }
};

const client = new OrchestrationClient(config);
```

#### Custom Destination

The `OrchestrationClient` can be initialized with a custom destination.
For example, to target `my-destination`, use the following code:

```ts
const client = new OrchestrationClient(
  orchestrationConfig,
  langchainOptions,
  deploymentConfig,
  { destinationName: 'my-destination' }
);
```

By default, the fetched destination is cached.
To disable caching, set the `useCache` parameter to `false` together with the `destinationName` parameter.

### Client Invocation

When invoking the client, pass a message history and, in most cases, input parameters for the template module.

```ts
const systemMessage = new SystemMessage('Be a helpful assisstant!');
const history = [systemMessage];
const response = await client.invoke(history, {
  inputParams: { subject: 'Paris' }
});
```

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
const client = new OrchestrationClient(orchestrationConfig, {
  maxRetries: 0
});
```

## Local Testing

For local testing instructions, refer to this [section](https://github.com/SAP/ai-sdk-js/blob/main/README.md#local-testing).

## Limitations

Currently unsupported features are:

- Streaming
- Tool Calling
