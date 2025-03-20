# @sap-ai-sdk/document-grounding

> [!warning]
> This package is still in **beta** and is subject to breaking changes. Use it with caution.

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package incorporates generative AI document grounding capabilities into your AI activities in SAP AI Core and SAP AI Launchpad.

### Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
  - [Create a Collection](#create-a-collection)
  - [Create a Document](#create-a-document)
  - [Custom Destination](#custom-destination)
- [Error Handling](#error-handling)
- [Local Testing](#local-testing)
- [Support, Feedback, Contribution](#support-feedback-contribution)
- [License](#license)

## Installation

```
$ npm install @sap-ai-sdk/document-grounding
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

The examples below demonstrate the usage of the most commonly used APIs in SAP AI Core document grounding service.
In addition to the examples below, you can find more **sample code** [here](https://github.com/SAP/ai-sdk-js/blob/main/sample-code/src/document-grounding.ts).

> Ensure that if you define your own resource group, it has the correct label to use the document grounding service.
> When creating the resource group on SAP AI Launchpad, add the key-value pair label: `document-grounding: true`.
> Alternatively, you can create the resource group via the orchestration API.
> For more details, refer to the [Creating a Resource Group for Grounding](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/create-resource-group-for-ai-data-management?locale=en-US) guide.

### Create a Collection

```ts
const response = await VectorApi.createCollection(
  {
    title: 'ai-sdk-js-e2e',
    embeddingConfig: {
      modelName: 'text-embedding-3-small'
    },
    metadata: []
  },
  {
    'AI-Resource-Group': 'default'
  }
).executeRaw();

const collectionId = (response.headers.location as string).split('/').at(-2);
```

### Create a Document

```ts
const response: DocumentsListResponse = await VectorApi.createDocuments(
  collectionId,
  {
    documents: [
      {
        metadata: [],
        chunks: [
          {
            content:
              'SAP Cloud SDK for AI is the official Software Development Kit (SDK) for SAP AI Core, SAP Generative AI Hub, and Orchestration Service.',
            metadata: []
          }
        ]
      }
    ]
  },
  {
    'AI-Resource-Group': 'default'
  }
).execute();
```

**Note:** Previous versions of this documentation referenced the `text-embedding-ada-002` model, which is now deprecated and scheduled for retirement on 2025-10-03.
All examples have been updated to use the recommended replacement models: `text-embedding-3-small` or `text-embedding-3-large`.

### Custom Destination

When calling the `execute()` method, it is possible to provide a custom destination.
For example, when querying deployments targeting a destination with the name `my-destination`, the following code can be used:

```ts
const response = await VectorApi.deleteCollectionById(collectionId, {
  'AI-Resource-Group': 'default'
}).execute({
  destinationName: 'my-destination'
});
```

## Error Handling

For error handling instructions, refer to this [section](https://github.com/SAP/ai-sdk-js/blob/main/README.md#error-handling).

## Local Testing

For local testing instructions, refer to this [section](https://github.com/SAP/ai-sdk-js/blob/main/README.md#local-testing).

## Support, Feedback, Contribution

Contribution and feedback are encouraged and always welcome.
For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0](http://www.apache.org/licenses/).
