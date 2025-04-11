# @sap-ai-sdk/document-grounding

> [!warning]
> This package is still in **beta** and is subject to breaking changes. Use it with caution.

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package incorporates generative AI document grounding capabilities into your AI activities in SAP AI Core and SAP AI Launchpad.

### Table of Contents

- [Installation](#installation)
- [Documentation](#documentation)
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

## Documentation

Visit the [SAP Cloud SDK for AI (JavaScript)](https://sap.github.io/ai-sdk/docs/js/overview-cloud-sdk-for-ai-js) documentation portal to learn more about its capabilities and detailed usage.

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
