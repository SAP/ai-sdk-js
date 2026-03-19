# Responses, Chat and Embeddings API

## Status

<!-- What is the status, such as decided, proposed, outdated -> one sentence reason, superseded -> link to followup ADR. -->

tentatively decided - reevaluate when implementing this

## Context

<!-- What is the issue that we're seeing that is motivating this decision or change? -->

Azure OpenAI introduced a new _Responses API_ that has similar functionality as the _Chat API_, but is stateful and supports message history compression.
Both APIs are still relevant for different use cases, which requires the SAP Cloud SDK for AI to reconsider the design (and maybe naming) of the already available clients.

## Decision

<!-- What is the change that we're proposing and/or doing? Only fill this when the status is decided. What becomes easier or more difficult to do because of this change? -->

# Discussion <!-- Optional -->

<!-- Details on the discussion leading to the decision.
Often a list of options with pros and cons including the selection implementation. -->

## Option A.1 - Keep everything as is with minimal renaming

We currently have one client for the Chat API and one for Embeddings.
We could keep them and add another for the Responses API:

```ts
// Responses API
const response = await new AzureOpenAiResponsesClient('gpt-5').create({
  input: 'Hello, my name is John'
});
```

We should adjust the naming to make it consistent:

```ts
// Chat API
const response = await new AzureOpenAiChatClient('gpt-5').createChatCompletion({
  messages: [...]
});
```

#### Pros

- clear separation between model and request configuration
- naming consistency

#### Cons

- streaming would require an extra method per non-streaming method (e.g. `createResponse()` and `streamCreateResponse()` or similar => naming not clean)
- duplicate naming (e.g. AzureOpenAi**Chat**Client and create**Chat**Completion)

## Option A.2 - Add Streaming Option

The current Chat and Embedding APIs each have one method `run()` and `stream()`.
The Responses API has more than one endpoint, so this approach doesn't work for this API.
With renamed method names (e.g. `createChatCompletion()`), naming becomes more difficult (e.g. `streamCreateChatCompletion()`);
Instead, the actual method should be the same for streaming and non streaming, and streaming should be toggled per option.

There are multiple places to put this option:

### Option A.2.1 - In the data

The `stream` option already exists in the data.
We could use it same as OpenAI does in their clients:

```ts
// Chat API
const response = await new AzureOpenAiChatClient('gpt-5').createChatCompletion({
  messages: [...],
  stream: true
});
```

#### Pros

- similar API as OpenAI

#### Cons

- differs from our other APIs, where data and config are separated

### Option A.2.2 - In options

We already have request options.
We could put them into one common options object:

```ts
// Chat API
const response = await new AzureOpenAiChatClient('gpt-5').createChatCompletion(
  {
    messages: [...]
  },
  {
    stream: true,
    requestConfig: {
      headers: { 'ai-resource-group': custom }
    }
  }
);
```

#### Pros

- all options in one place

#### Cons

- request options are nested deeper

### Option A.2.2 - Through chaining

```ts
// Chat API
const response = await new AzureOpenAiChatClient('gpt-5')
  .stream()
  .createChatCompletion({
    messages: [...]
  });
```

#### Pros

- no changes to the API needed

#### Cons

- maybe atypical for JS

## Option B.1

The naming currently includes quite a long prefix, making the client classes a bit wonky, especially if there are more than 2 now.
We could consider something like a namespaces to organize the clients.
Namespaces are not recommended in modern TS as many build tools cannot handle them, therefore I would bring in structure through exports:

```ts
import { AzureOpenAi } from '@sap-ai-sdk/foundation-models';

// Chat API
const response = await new AzureOpenAi.ChatClient('gpt-5').create({
  messages: [...]
});
```

alternative usage:

```ts
import { ChatClient } from '@sap-ai-sdk/foundation-models/azure-openai';

// Chat API
const response = await new ChatClient('gpt-5').createChatCompletion({
  messages: [...]
});
```

#### Pros

- clearer naming and grouping

#### Cons

- less context in user issues, if import path not given

## Option B.2

We could even get rid of the classes on API level, further shortening the naming, by exporting builder functions instead:

```ts
import { AzureOpenAi } from '@sap-ai-sdk/foundation-models';

// Chat API
const response = await AzureOpenAi.chat('gpt-5').createChatCompletion({
  messages: [...]
});
```

alternative usage:

```ts
import { chat } from '@sap-ai-sdk/foundation-models/azure-openai';

// Chat API
const response = await chat('gpt-5').createChatCompletion({
  messages: [...]
});
```

Naming could also be `chatClient()`, `chatApi()` or similar.

#### Pros

- shorter naming

#### Cons

-

## Option C

Actually? Why do we have our own clients, when there are clients from OpenAI that are maintained by OpenAI?
We could provide a helper function to retrieve a config based on destination, model deployment configuration and API version.

This is a hands-on PoC: https://github.tools.sap/I824643/responses-api-poc.

```ts
import { AzureOpenAI } from 'openai/azure.js';
import { createAzureOpenAiClientOptions } from '@sap-ai-sdk/foundation-models';

// SAP Cloud SDK for AI part
const options = await createAzureOpenAiClientOptions('gpt-5');

// OpenAI part
const client = new AzureOpenAI(options);

const response = await client.responses.create({
  model: 'gpt-5',
  instructions: 'You are a coding assistant that talks like a pirate',
  input: 'Are semicolons optional in JavaScript?'
});
```

#### Pros

- no maintenance, updating and documentation effort for a whole client, only it's configuration
- users might already be used to the API, no new abstractions

#### Cons

- AzureOpenAI requires the `model` to be set in the payload (but apparently the value doesn't matter) => potentially forces users to pass the model twice
- SAP Cloud SDK features like resilience could not be offered OOB anymore

#### Open Concerns

- How does OpenAI SDK handle errors?
- How can we ensure a smooth migration path, when OpenAI SDK has a major version update with breaking changes?
- Is it a problem that users could simply overwrite the "ai-client-type" header?

## Outlook

We should consider how OpenAI's WebSocket API (`Session`) plays into this.
Option C is likely already future proof in this sense.

## Option D

Option C requires (and if it was optional: allows) users to set the model.
However, the model is already defined through the deployment.
In order to prevent confusion we could take back more ownership and wrap the official client.

```ts
import { AzureOpenAI } from 'openai/azure.js';
import { createAzureOpenAiClient } from '@sap-ai-sdk/foundation-models';

// SAP Cloud SDK for AI part
const client: AzureOpenAI = await createAzureOpenAiClient('gpt-5');

const response = await client.responses.create({
  // model: 'gpt-5', // cannot be set anymore as SDK removed it from the types
  instructions: 'You are a coding assistant that talks like a pirate',
  input: 'Are semicolons optional in JavaScript?'
});
```

#### Pros

- less maintenance, updating and documentation effort than for a whole client
- users might already be used to the API, no new abstractions
- more ownership
- SAP Cloud SDK features like resilience could be offered OOB

#### Cons

- tighter coupling between SDK and OpenAI amplifies: support responsibility lines more blurred

## Outlook

We should consider how OpenAI's WebSocket API (`Session`) plays into this.
Option C is likely already future proof in this sense.
