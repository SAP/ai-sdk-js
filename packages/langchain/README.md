# @sap-ai-sdk/langchain

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package provides LangChain model clients built on top of the foundation model clients of the SAP Cloud SDK for AI.

### Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Relationship between Models and Deployment ID](#relationship-between-models-and-deployment-id)
- [Usage](#usage)
  - [SAP Orchestration Service](#sap-orchestration-service)
  - [Azure OpenAI](#azure-openai)
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

This package offers LangChain clients for Azure OpenAI as well as the SAP orchestration service
All clients comply with [LangChain's interface](https://js.langchain.com/docs/introduction).

### SAP Orchestration Service

For details on the orchestration client, refer to this [document](./src/orchestration/README.md).

### Azure OpenAI

For details on the Azure OpenAI clients, refer to this [document](./src/openai/README.md).

## Local Testing

For local testing instructions, refer to this [section](https://github.com/SAP/ai-sdk-js/blob/main/README.md#local-testing).

## Support, Feedback, Contribution

This project is open to feature requests, bug reports and questions via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome.
For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/).
