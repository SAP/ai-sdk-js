# @sap-ai-sdk/langchain

This package contains langchain compliant models, based on the @sap-ai-sdk clients.

### Installation

```
$ npm install @sap-ai-sdk/langchain

$ npm install @langchain/openai // if you want to use OpenAI models
```

## Pre-requisites

- [Enable the AI Core service in BTP](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/initial-setup).
- Project configured with Node.js v20 or higher and native ESM support enabled.
- For testing your application locally:
  - Download a service key for your AI Core service instance.
  - Create a `.env` file in the sample-code directory.
  - Add an entry `AICORE_SERVICE_KEY='<content-of-service-key>'`.

## Usage

All client's comply with langchains interface, therefore you should be able to use them as per usual.

The only difference is in the initialization of the client, where you have to option to pass either:

```ts
    modelName: string,
    modelVersion?: string,
    resourceGroup?: string,
    ...others
```

or

```ts
    deploymentId: string,
    resourceGroup?: string
    ...others
```

Below are are the usage of OpenAI's chat and embedding client.

### OpenAI

#### Chat

There are two common APIs, `.invoke()` for simple text completion and `.generate()` for chat completion.
You can also combine them with the usual langchain functionality, e.g. prompt templates.

A simple text completion might look like:

```ts
const client = new OpenAIChat({ modelName: 'gpt-4o' });

const response = await client.invoke("What's the capital of france?'");
```

A chat completion example might be:

```ts
const response = await client.generate([
  [new SystemMessage('You are acting super cool.')],
  [new HumanMessage('Whats up')]
]);
```

#### Embedding

You have the option to either embed a text, or a document (an array of strings).

Below are two examples.

```ts
const client = new OpenAIEmbedding({ modelName: 'text-embedding-ada-002' });
const embedding = await client.embedQuery('Paris is the capitol of France');
const embeddedDocument = await client.embedDocuments([
  'Page 1: Paris is the capitol of France',
  'Page 2: It is a beautiful city'
]);
```

## Support, Feedback, Contribution

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/)
