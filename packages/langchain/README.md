# @sap-ai-sdk/langchain

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package provides LangChain clients built on top of the foundation model and orchestration clients of the SAP Cloud SDK for AI.

### Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
  - [SAP Orchestration Client](#sap-orchestration-client)
  - [Azure OpenAI Client](#azure-openai-client)
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
- Ensure that a relevant deployment is available in the SAP Generative AI Hub:
  - Use the [`DeploymentApi`](https://github.com/SAP/ai-sdk-js/blob/main/packages/ai-api/README.md#create-a-deployment) from `@sap-ai-sdk/ai-api` or the [SAP AI Launchpad](https://help.sap.com/docs/sap-ai-core/generative-ai-hub/activate-generative-ai-hub-for-sap-ai-launchpad?locale=en-US&q=launchpad) to create a deployment.
    - For **OpenAI models**, follow [this guide](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-generative-ai-model-in-sap-ai-core).
    - For **orchestration services**, follow [this guide](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-deployment-for-orchestration).
  - Once deployed, access the service via the `deploymentUrl`.

> **Accessing the AI Core Service via the SDK**
>
> The SDK automatically retrieves the `AI Core` service credentials and resolves the access token needed for authentication.
>
> - In Cloud Foundry, it's accessed from the `VCAP_SERVICES` environment variable.
> - In Kubernetes / Kyma environments, you have to mount the service binding as a secret instead, for more information refer to [this documentation](https://www.npmjs.com/package/@sap/xsenv#usage-in-kubernetes).

## Usage

This package offers LangChain clients for Azure OpenAI and SAP Orchestration service.
All clients comply with [LangChain's interface](https://js.langchain.com/docs/introduction).

### Orchestration Client

For more information about the Orchestration client, refer to the [documentation](https://github.com/SAP/ai-sdk-js/tree/main/packages/langchain/src/orchestration/README.md).

### Azure OpenAI Client

For more information about Azure OpenAI client, refer to the [documentation](https://github.com/SAP/ai-sdk-js/tree/main/packages/langchain/src/openai/README.md).

## Local Testing

For local testing instructions, refer to this [section](https://github.com/SAP/ai-sdk-js/blob/main/README.md#local-testing).

## Support, Feedback, Contribution

This project is open to feature requests, bug reports and questions via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome.
For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/).
