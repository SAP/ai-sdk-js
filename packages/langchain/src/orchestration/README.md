# @sap-ai-sdk/langchain

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package provides LangChain model clients built on top of the foundation model clients of the SAP Cloud SDK for AI.

### Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Relationship between Models and Deployment ID](#relationship-between-models-and-deployment-id)
- [Usage](#usage)
  - [Client Initialization](#client-initialization)
  - [Client](#client)
    - [Resilience](#resilience)
- [Local Testing](#local-testing)
- [Limitations](#limitations)

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

This package offers a LangChain orchestration service client.
It does not support streaming yet.
The client complies with the [LangChain's interface](https://js.langchain.com/docs/introduction).

### Client Initialization

To initialize the client, you can provide 4 different configurations.
The only required one is the [orchestration configuration](), however, you can also set:

-     public langchainOptions: BaseChatModelParams = {},
  public deploymentConfig?: ResourceGroupConfig,
  public destination?: HttpDestinationOrFetchOptions

A minimal example to instantiate the orchestration client uses a template and model name:

```ts
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

const client = new OrchestratioClient(config);
```

#### Custom Destination

When initializing the `OrchestrationClient`, it is possible to provide a custom destination.
For example, when targeting a destination with the name `my-destination`, the following code can be used:

```ts
const client = new OrchestrationClient(
  orchestrationConfig,
  langchainOptions,
  deploymentConfig,
  {
    destinationName: 'my-destination'
  }
);
```

By default, the fetched destination is cached.
To disable caching, set the `useCache` parameter to `false` together with the `destinationName` parameter.

### Client Invocation

When invoking the client, you only have to pass a message history and most of the time input parameters for the template module.

```ts
const systemMessage = new SystemMessage('Be a helpful assisstant!');
const history = [systemMessage];
const response = await client.invoke(history, {
  inputParams: { subject: 'paris' }
});
```

#### Resilience

If you need to add resilience to your client, you can make use of the default options available in LangChain, most importantly `timeout` and `maxRetry`.

##### Timeout

By default, there is no timeout set in the client, if you want to limit the maximum duration the entire request, including retries, should take,
you can set a timeout duration in ms when using the invoke method:

```ts
const response = await client.invoke(messageHistory, { timeout: 10000 });
```

##### Retry

By default, LangChain clients retry 6 times, if you want to adjust this behavior, you need to do so at client initialization:

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
