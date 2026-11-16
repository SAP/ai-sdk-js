# SAP Cloud SDK for AI Anthropic Client

> [!warning]
> This package is still in **beta** and is subject to breaking changes. Use it with caution.

SAP Cloud SDK for AI is the official Software Development Kit (SDK) for **SAP AI Core**, **SAP Generative AI Hub**, and **Orchestration Service**.

This package provides an integration with the official [`@anthropic-ai/bedrock-sdk`](https://www.npmjs.com/package/@anthropic-ai/bedrock-sdk) npm package, pre-configured for Anthropic deployments on SAP AI Core.
It handles deployment resolution, authentication, and SAP-specific headers automatically.
The upstream SDK strips `model` from the Invoke request body.
SAP AI Core routes requests via the deployment URL.
The client is named `SapAnthropicBedrockInvoke` to distinguish this integration from future integrations targeting other Anthropic APIs, such as the Messages API.

## Installation

```sh
npm install @sap-ai-sdk/anthropic @anthropic-ai/bedrock-sdk @anthropic-ai/sdk
```

## Messages

```ts
import { SapAnthropicBedrockInvoke } from '@sap-ai-sdk/anthropic';

const model = 'anthropic--claude-4.6-sonnet';
const client = await SapAnthropicBedrockInvoke.createClient(model);
const message = await client.messages.create({
  model,
  max_tokens: 100,
  messages: [{ role: 'user', content: 'Hello!' }]
});
console.log(message.content);
```

Configure an AI Core service binding or `AICORE_SERVICE_KEY` for local development.
To select a deployment explicitly, pass `{ deployment: { deploymentId, resourceGroup }, destination?, clientType?, anthropicConfig? }`.
The upstream `model` field remains required; SAP AI Core selects the actual model through the resolved deployment URL.

`anthropicConfig` and `withOptions()` accept transport settings such as fetch, middleware, retries, and timeouts.
They preserve SAP-managed deployment routing and authentication:

## Streaming

```ts
const stream = client.messages.stream({
  model,
  max_tokens: 100,
  messages: [{ role: 'user', content: 'Write a short poem.' }]
});
stream.on('text', text => process.stdout.write(text));
const message = await stream.finalMessage();
```
