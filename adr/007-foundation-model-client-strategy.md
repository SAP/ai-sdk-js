# Foundation Model Client Strategy

## Status

<!-- What is the status, such as decided, proposed, outdated -> one sentence reason, superseded -> link to followup ADR. -->
proposed

## Context

<!-- What is the issue that we're seeing that is motivating this decision or change? -->
At the moment of writing, we only support Azure OpenAI with chat completion.
The current approach is to generate types based on the Azure OpenAI OpenAPI spec (prior to the v1 API), then handwrite a client.
However the market is evolving rapidly, further features such as Responses API or Realtime API need to be supported.
There are also demands for supporting other LLM providers.
Thus, we need to review our current approach, if it can be extended for supporting new features and potentially new providers within a reasonable effort, or suggest alternatives.

## Decision

<!-- What is the change that we're proposing and/or doing? Only fill this when the status is decided. What becomes easier or more difficult to do because of this change? -->

> [!WARNING]
> This is a proposal and not decided yet.
> We will decide on the approach after collecting user feedback.

B.3

We propose to migrate to the official provider SDKs, and provide a configured client based on the official provider SDKs.
Optionally for advanced users, if possible we also expose create configuration function for the official provider SDKs.

# Discussion <!-- Optional -->

<!-- Details on the discussion leading to the decision.
Often a list of options with pros and cons including the selection implementation. -->

## Option A: Handwrite client (Continue current approach)

We continue to handwrite the client with auto-generated types based on the OpenAPI spec.
When new features or providers need to be supported, we will update the client code accordingly.

Pros:

- Full control over the client implementation.
- Minimal or no breaking changes with gradual updates following our current approach.
- Full control of SDK quality and feature scope.

Cons:

- High implementation effort and pressure to support new provider features given the rapid evolution of the market
- Approach not scalable for supporting other providers.
  - Not all of them have a well-defined OpenAPI spec.
  - We need to handwrite client for each provider.
  - Implementation effort may be high due to the newer OpenAPI spec versions (> 3.0).
  - We are not from the provider side, thus we are always much slower than the market and do not have first-hand information.

## Option B: Migrate to official provider SDKs

Provider SDKs vary in quality and extensibility.
But after a preliminary evaluation, many of them can be patched to support SAP AI Core deployments.
Ideally, llm access service from AI Core should provide seamless experience as the provider APIs.
Therefore, we almost only need to consider the configuration part of the provider SDKs to fit into the AI Core design

1. Automatically resolve the deployment URL based on the model name, resource group and so on, and construct URL for provider SDKs
2. Retrieve and, if possible, refresh authorization token based on the AI Core service secret and set the authorization header
3. Add the SAP Cloud SDK for AI header for better usage tracking

### Option B.1: Provide configuration for official provider SDKs

First, we consider migrating our existing Azure OpenAI client to the official `OpenAI` SDK, which is widely used and has good extensibility.
Users can create a configuration object based on the input for AI Core.

```ts
import { tokenProvider } from "@sap-ai-sdk/core";

export function createOpenAIConfig(options: any): OpenAIConfig {
  // resolve deployment URL based on the input options
  const baseURL = resolveDeploymentUrl(options);

  return {
    baseURL,
    defaultHeaders: {
      'AI-Resource-Group': options.resourceGroup
    },
    apiVersion: options.apiVersion,
    azureADTokenProvider: tokenProvider
  };
}
```

Then supply this configuration to the official SDK to create client instances.

```ts
import { AzureOpenAI } from "openai";
import { createOpenAIConfig } from "@sap-ai-sdk/foundation-models";

const config = createOpenAIConfig({
  model: "gpt-5",
  resourceGroup: "rg",
});

// Or in short:
// const config = createOpenAIConfig('gpt-5');

const client = new AzureOpenAI(config);
client.chat.completions.create({
  model: "gpt-5", // Unfortunately must be defined here again
  messages: [
    { role: "user", content: "Hello world" }
  ]
});
```

Pros:

- Minimal implementation effort with fast support for new features.
- No hard dependency on the provider SDK.

Cons:

- In case constructor has breaking changes, we cannot hide it from users and must provide a new configuration function.
- For other providers such as Google GenAI and AWS Bedrock, there is no easy way to provide everything as a single configuration object, leading to inconsistent user experience. Users need even dummy placeholders or hacky workarounds inside the provider client constructors.
- We cannot override the client implementation to, e.g., hide the `model` parameter in the chat completion create call.

### Option B.2: Provide configured client based on official provider SDKs

We can also provide a configured client based on the official provider SDKs, which encapsulates the configuration.

```ts
import { createAzureOpenAIClient } from "@sap-ai-sdk/foundation-models";

const client = createAzureOpenAIClient({
  model: "gpt-5",
  resourceGroup: "rg",
});
client.chat.completions.create({
  // model: "gpt-5", // No need to specify the model again, as the function was overriden to hide this parameter
  messages: [
    { role: "user", content: "Hello world" }
  ]
});
```

Pros:

- We still have the chance to monkey patch the provider client implementation.
- We manage the `OpenAI` SDK dependency so that users do not need to worry about the compatibility between the client and the SDK version.
- Same approach can be applied to other providers for hiding hacking details, providing a consistent user experience.
- In case of provider SDK or service breaking changes, we can intercept at least those related to configuration such as URL construction.
- Hide dummy values or hacky workarounds from users.
- Python SDK already follows this approach and we know this is widely accepted by users.

Cons:

- Hard dependency on the provider SDK, meaning in case of a major version upgrade from the provider, we also need to bump.
- Users might assume that our client always work with the AI Core server side.

We must have plenty of E2E tests covering most features so that we identify issues ASAP before users do.

### Option B.3: Provide both configuration and configured client

This option is a combination of B.1 and B.2, where we provide both the configuration and the configured client for users to choose.

Pros:

- No noticeable extra effort compared to B.2 but with more flexibility for users to choose.
- Same approach can be extended to other providers, providing a consistent user experience.
- Allow us to have discussion with users and collect early feedback instead of we blindly choose one approach.

Cons:

- User might be confused about what to use.
- We need to maintain both the configuration and the configured client. 
