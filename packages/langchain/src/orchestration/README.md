# LangChain Orchestration Client

LangChain orchestration client utilizes `@sap-ai-sdk/orchestration` package and provides an interface to interact with the Orchestration Service when using LangChain.

> **Note**: For installation and prerequisites of the package `@sap-ai-sdk/langchain`, refer to the [README](../../README.md).

### Table of Contents

- [Usage](#usage)
  - [Client Initialization](#client-initialization)
  - [Client Invocation](#client-invocation)
- [Local Testing](#local-testing)
- [Limitations](#limitations)

## Usage

The client complies with [LangChain's interface](https://js.langchain.com/docs/introduction).
Currently, streaming is not supported.

### Client Initialization

To initialize a client, four different configurations can be provided.
Orchestration configuration is mandatory and its usage is explained in our [`orchestration client`](https://github.com/SAP/ai-sdk-js/blob/main/packages/orchestration/README.md).
Optionally, it is possible to set [LangChain options](https://v03.api.js.langchain.com/types/_langchain_core.language_models_chat_models.BaseChatModelParams.html), a custom resource group, and a destination of the SAP AI Core service.

Below is an example for instantiating the orchestration client for LangChain:

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

The `OrchestrationClient` can be initialized with a custom destination of the SAP AI Core service.
For example, use the following code to target a specific destination:

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

If the error is caused by input content filtering, the client will throw immediately without retrying.

## Local Testing

For local testing instructions, refer to this [section](https://github.com/SAP/ai-sdk-js/blob/main/README.md#local-testing).

## Limitations

Currently unsupported features are:

- Streaming
- Tool Calling
