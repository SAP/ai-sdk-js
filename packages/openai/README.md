# @sap-ai-sdk/openai

> [!CAUTION]
> This package is currently experimental and subject to change.
> Do not use in production.

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package provides an integration with the official [`openai`](https://www.npmjs.com/package/openai) npm package, pre-configured for Azure OpenAI deployments on SAP AI Core.
It handles deployment resolution, authentication, and SAP-specific headers automatically, and removes the `model` parameter from request signatures since SAP AI Core routes requests via the deployment URL.

### Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
  - [High-level client](#high-level-client)
  - [Low-level config](#low-level-config)
  - [Token provider](#token-provider)
- [Documentation](#documentation)

- [Support, Feedback, Contribution](#support-feedback-contribution)
- [License](#license)

## Installation

```
$ npm install @sap-ai-sdk/openai
```

The `openai` package is a peer dependency and must be installed separately:

```
$ npm install openai
```

## Prerequisites

- An SAP AI Core service instance with an Azure OpenAI deployment running.
- The service binding or `AICORE_SERVICE_KEY` environment variable configured (for local testing).

## Usage

### High-level client

`SapOpenAi` is the recommended entry point.
It wraps `AzureOpenAI` from the `openai` package and exposes only the endpoints supported by SAP AI Core: `chat`, `embeddings`, and `responses`.

```ts
import { SapOpenAi } from '@sap-ai-sdk/openai';
import { zodResponseFormat, zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';

// Chat completions
const chatClient = await SapOpenAi.createClient('gpt-5.4');
// or const chatClient = await SapOpenAi.createClient({ deployment: 'gpt-5.4' });
const response = await chatClient.chat.completions.create({
  messages: [{ role: 'user', content: 'What is the capital of France?' }]
});

// Structured output via parse
const CapitalResponse = z.object({ capital: z.string() });
const parsed = await chatClient.chat.completions.parse({
  messages: [{ role: 'user', content: 'What is the capital of France?' }],
  response_format: zodResponseFormat(CapitalResponse, 'capital_response')
});

// Embeddings
const embeddingClient = await SapOpenAi.createClient('text-embedding-3-small');
const embedding = await embeddingClient.embeddings.create({
  input: 'Hello, world!'
});

// Responses API
const responsesClient = await SapOpenAi.createClient('gpt-5.4');
const resp = await responsesClient.responses.create({
  instructions: 'You are a helpful assistant.',
  input: 'What is the capital of France?'
});
```

`deployment` accepts a model name string, `{ modelName, modelVersion? }`, or `{ deploymentId }`.
An optional `resourceGroup` can be included in the object form.

```ts
// By model name and version
const client = await SapOpenAi.createClient({
  deployment: { modelName: 'gpt-5.4', modelVersion: '2025-04-14' }
});

// By deployment ID
const client = await SapOpenAi.createClient({
  deployment: { deploymentId: 'd1234567890abcdef' }
});
```

### Low-level config

Use `createOpenAiConfig` if you need to instantiate `AzureOpenAI` directly (e.g. to access endpoints not exposed by `SapOpenAi`):

```ts
import { AzureOpenAI } from 'openai';
import { createOpenAiConfig } from '@sap-ai-sdk/openai';

const config = await createOpenAiConfig('gpt-5.4');
const client = new AzureOpenAI(config);
```

### Token provider

`createTokenProvider` returns an `azureADTokenProvider`-compatible function that resolves the bearer token from the AI Core destination on each call.
It is used internally by `createOpenAiConfig`.

## Documentation

Visit the [SAP Cloud SDK for AI (JavaScript)](https://sap.github.io/ai-sdk/docs/js/overview-cloud-sdk-for-ai-js) documentation portal to learn more about its capabilities and detailed usage.

## Support, Feedback, Contribution

Contribution and feedback are encouraged and always welcome.
For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0](http://www.apache.org/licenses/).
