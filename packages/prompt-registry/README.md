> [!warning]
> This package is still in **beta** and is subject to breaking changes. Use it with caution.

# @sap-ai-sdk/prompt-registry

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package incorporates generative AI prompt registry capabilities into your AI activities in SAP AI Core and SAP AI Launchpad.

### Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
  - [List Prompt Templates](#list-prompt-templates)
  - [Custom Destination](#custom-destination)
- [Local Testing](#local-testing)
- [Support, Feedback, Contribution](#support-feedback-contribution)
- [License](#license)

## Installation

```
$ npm install @sap-ai-sdk/prompt-registry
```

## Prerequisites

- [Enable the AI Core service in SAP BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/initial-setup).
- Configure the project with **Node.js v20 or higher** and **native ESM** support.

> **Accessing the AI Core Service via the SDK**
>
> The SDK automatically retrieves the `AI Core` service credentials and resolves the access token needed for authentication.
>
> - In Cloud Foundry, it's accessed from the `VCAP_SERVICES` environment variable.
> - In Kubernetes / Kyma environments, you have to mount the service binding as a secret instead, for more information refer to [this documentation](https://www.npmjs.com/package/@sap/xsenv#usage-in-kubernetes).

## Usage

The example below demonstrate a sample usage of APIs in SAP AI Core prompt registry service.

In addition, you can find more **sample code** [here](https://github.com/SAP/ai-sdk-js/blob/main/sample-code/src/prompt-registry.ts).

### List Prompt Templates

```ts
const response: PromptTemplateListResponse =
  await PromptTemplatesApi.listPromptTemplates({
    scenario: 'test'
  }).execute();
```

### Custom Destination

When calling the `execute()` method, it is possible to provide a custom destination.
For example, when querying deployments targeting a destination with the name `my-destination`, the following code can be used:

```ts
const response: PromptTemplateListResponse =
  await PromptTemplatesApi.listPromptTemplates({
    scenario: 'test'
  }).execute({
    destinationName: 'my-destination'
  });
```

## Local Testing

For local testing instructions, refer to this [section](https://github.com/SAP/ai-sdk-js/blob/main/README.md#local-testing).

## Support, Feedback, Contribution

Contribution and feedback are encouraged and always welcome.
For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0](http://www.apache.org/licenses/).
