# @sap-ai-sdk/anthropic

> [!warning]
> This package is still in **beta** and is subject to breaking changes. Use it with caution.

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package provides an integration with the official [`@anthropic-ai/bedrock-sdk`](https://www.npmjs.com/package/@anthropic-ai/bedrock-sdk) npm package, pre-configured for Anthropic deployments on SAP AI Core.
It handles deployment resolution, authentication, and SAP-specific headers automatically.
The client is named `SapAnthropicBedrockInvoke` to distinguish this integration from future integrations targeting other Anthropic APIs, such as the Messages API.

## Installation

```sh
npm install @sap-ai-sdk/anthropic @anthropic-ai/bedrock-sdk @anthropic-ai/sdk
```

## Messages

```ts
import { SapAnthropicBedrockInvoke } from '@sap-ai-sdk/anthropic';

const client = new SapAnthropicBedrockInvoke();
const message = await client.messages.create({
  model: 'anthropic--claude-4.6-sonnet',
  max_tokens: 100,
  messages: [{ role: 'user', content: 'Hello!' }]
});
console.log(message.content);
```

Configure an AI Core service binding or `AICORE_SERVICE_KEY` for local development.
The constructor accepts `{ resourceGroup?, destination?, clientType?, anthropicConfig? }`.
The resource group defaults to `default`.

The request `model` selects a running AWS Bedrock deployment in the configured resource group for every request.
It accepts the following values:

- A model name, for example `anthropic--claude-4.6-sonnet`. The client uses the first matching deployment.
- A model name and version, for example `anthropic--claude-4.6-sonnet:1`.
- A deployment ID, for example for custom deployments.

Model names take precedence over deployment IDs.

`anthropicConfig` and `withOptions()` accept transport settings such as fetch, middleware, retries, and timeouts.
They preserve SAP-managed deployment routing and authentication.

## Streaming

```ts
const stream = client.messages.stream({
  model: 'anthropic--claude-4.6-sonnet',
  max_tokens: 100,
  messages: [{ role: 'user', content: 'Write a short poem.' }]
});
stream.on('text', text => process.stdout.write(text));
const message = await stream.finalMessage();
```

## Support, Feedback, Contribution

Contribution and feedback are encouraged and always welcome.
For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](https://github.com/SAP/ai-sdk-js/blob/main/CONTRIBUTING.md).

## License

The SAP Cloud SDK for AI is released under the [Apache License Version 2.0](http://www.apache.org/licenses/).
