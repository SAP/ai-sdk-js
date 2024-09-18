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

## Azure OpenAI client

The Azure OpenAI client can be used to send chat completion or embedding requests to OpenAI models deployed in SAP generative AI hub.

### Prerequisites

- A deployed OpenAI model in SAP generative AI hub.
  - You can use the [`DeploymentApi`](../ai-api/README.md#deploymentapi) from `@sap-ai-sdk/ai-api` to deploy a model to SAP generative AI hub.
- `sap-ai-sdk/foundation-models` package installed in your project.

### Azure OpenAI chat client usage

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
    })
const responseContent = response.getContent();
```

It is also possible to create a chat client by passing a `deploymentId` instead of a `modelName`.

On the response obtained from the client, you could also use convenience functions like `getContent()`, `getFinishReason()` and `getTokenUsage()` to get easy access to the certain parts of the response.

### Azure OpenAI Embedding client usage

```TS
import { OpenAiEmbeddingClient } from '@sap-ai-sdk/foundation-models';

const client = new OpenAiEmbeddingClient({ deploymentId: 'd123456abcdefg' });
const response = await client.run({
      input: 'AI is fascinating'
    });
const embedding = response.data[0]?.embedding;
```

It is also possible to create an embedding client by passing a `modelName` instead of a `deploymentId`.

## Caching

The deployment information which includes deployment id and properties like model name and model version is also cached by default for 5 mins. So, if you create an OpenAI client with a `modelName`, the deployment information is fetched from the cache if it is available.

## Support, Feedback, Contribution

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/SAP/ai-sdk-js/issues).

Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0.](http://www.apache.org/licenses/)
