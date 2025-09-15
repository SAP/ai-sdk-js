# SAP Cloud SDK for AI v2 Upgrade Guide

This document guides you through upgrading from version 1.x to version 2.x of the SAP Cloud SDK for AI packages.
It covers all breaking changes and migration steps required for the upgrade.
Version 2.x introduces significant structural changes to align with updated service APIs.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [How to Upgrade](#how-to-upgrade)
- [Breaking Changes](#breaking-changes)
  - [`@sap-ai-sdk/foundation-models`](#sap-ai-sdkfoundation-models)
  - [`@sap-ai-sdk/orchestration`](#sap-ai-sdkorchestration)
  - [`@sap-ai-sdk/langchain`](#sap-ai-sdklangchain)

## How to Upgrade

Update all SAP Cloud SDK for AI packages to version 2.x in your `package.json` file:

```diff
{
  "dependencies": {
-   "@sap-ai-sdk/ai-api": "^1.x.x",
-   "@sap-ai-sdk/core": "^1.x.x",
-   "@sap-ai-sdk/document-grounding": "^1.x.x",
-   "@sap-ai-sdk/foundation-models": "^1.x.x",
-   "@sap-ai-sdk/langchain": "^1.x.x",
-   "@sap-ai-sdk/orchestration": "^1.x.x",
-   "@sap-ai-sdk/prompt-registry": "^1.x.x",
+   "@sap-ai-sdk/ai-api": "^2.x.x",
+   "@sap-ai-sdk/core": "^2.x.x",
+   "@sap-ai-sdk/document-grounding": "^2.x.x",
+   "@sap-ai-sdk/foundation-models": "^2.x.x",
+   "@sap-ai-sdk/langchain": "^2.x.x",
+   "@sap-ai-sdk/orchestration": "^2.x.x",
+   "@sap-ai-sdk/prompt-registry": "^2.x.x"
  }
}
```

## Breaking Changes

### `@sap-ai-sdk/foundation-models`

#### Stream Method Parameter Change

The `stream()` method now accepts an `AbortSignal` instead of an `AbortController` as the second parameter.

**v1:**
```typescript
const controller = new AbortController();
const response = await azureOpenAiChatClient.stream(
  {
    messages: [{ role: 'user', content: 'Hello' }],
    max_tokens: 100
  },
  controller  // Pass the controller
);
```

**v2:**
```typescript
const controller = new AbortController();
const response = await azureOpenAiChatClient.stream(
  {
    messages: [{ role: 'user', content: 'Hello' }],
    max_tokens: 100
  },
  controller.signal  // Pass the signal instead
);
```

#### Type Import Changes

Generated types are no longer exported from `@sap-ai-sdk/foundation-models`.
For frequently used types in most cases, they remain available from the public exports.
For edge cases where the underlying generated types are used, they must be imported from `@sap-ai-sdk/foundation-models/internal.js`.

**v1:**
```typescript
import type { 
  AzureOpenAiCreateChatCompletionRequest,
  AzureOpenAiCreateChatCompletionResponse 
} from '@sap-ai-sdk/foundation-models';
```

**v2:**
```typescript
// Generated types must be imported from internal
import type { 
  AzureOpenAiCreateChatCompletionRequest,
  AzureOpenAiCreateChatCompletionResponse 
} from '@sap-ai-sdk/foundation-models/internal.js';
```

```typescript
// Frequently used types remain available from main package
import type { 
  AzureOpenAiChatCompletionTool,
  AzureOpenAiFunctionObject,
  AzureOpenAiChatCompletionRequestMessage,
  AzureOpenAiChatCompletionRequestSystemMessage,
  AzureOpenAiChatCompletionRequestUserMessage,
  AzureOpenAiChatCompletionRequestAssistantMessage,
  AzureOpenAiChatCompletionRequestToolMessage
} from '@sap-ai-sdk/foundation-models';
```

#### Chat Completion Parameter Type

The `AzureOpenAiCreateChatCompletionRequest` type is no longer exported publicly.
Use the new `AzureOpenAiChatCompletionParameters` type instead.

**v1:**
```typescript
import type { AzureOpenAiCreateChatCompletionRequest } from '@sap-ai-sdk/foundation-models';

const request: AzureOpenAiCreateChatCompletionRequest = {
  messages: [{ role: 'user', content: 'Hello' }],
  max_tokens: 100
};
```

**v2:**
```typescript
import type { AzureOpenAiChatCompletionParameters } from '@sap-ai-sdk/foundation-models';

const request: AzureOpenAiChatCompletionParameters = {
  messages: [{ role: 'user', content: 'Hello' }],
  max_tokens: 100
};
```

#### Response Object Data Property Changes

The `data` property in response objects is renamed to `_data`.
Prefer using the provided getter methods instead of accessing the data object directly.

**Affected Response Classes:**
- `AzureOpenAiChatCompletionResponse`
- `AzureOpenAiChatCompletionStreamChunkResponse`
- `AzureOpenAiEmbeddingResponse`

### `@sap-ai-sdk/orchestration`

#### Stream Method Parameter Change

The `stream()` method now accepts an `AbortSignal` instead of an `AbortController` as the second parameter.

**v1:**
```typescript
const controller = new AbortController();
const response = await orchestrationClient.stream(
  { messages: [{ role: 'user', content: 'Hello' }] },
  controller  // Pass the controller
);
```

**v2:**
```typescript
const controller = new AbortController();
const response = await orchestrationClient.stream(
  { messages: [{ role: 'user', content: 'Hello' }] },
  controller.signal  // Pass the signal instead
);
```

#### Type Import Changes

Generated types are no longer exported from `@sap-ai-sdk/orchestration`.
For frequently used types in most cases, they remain available from the public exports.
For edge cases where the underlying generated types are used, they must be imported from `@sap-ai-sdk/orchestration/internal.js`.

**v1:**
```typescript
import type { 
  CompletionPostResponse,
  LlmChoice 
} from '@sap-ai-sdk/orchestration';
```

**v2:**
```typescript
// Generated types must be imported from internal
import type { 
  CompletionPostResponse,
  LlmChoice 
} from '@sap-ai-sdk/orchestration/internal.js';
```

```typescript
// Frequently used types remain available from main package
import type { 
  ChatMessage,
  SystemChatMessage,
  UserChatMessage,
  AssistantChatMessage,
  ToolChatMessage,
  DeveloperChatMessage,
  ChatCompletionTool,
  FunctionObject
} from '@sap-ai-sdk/orchestration';
```

#### Response Object Data Property Changes

The `data` property in response objects is renamed to `_data`.
Prefer using the provided getter methods instead of accessing the data object directly.

**Affected Response Classes:**
- `OrchestrationResponse`
- `OrchestrationStreamResponse`
- `OrchestrationStreamChunkResponse`

#### Module Configuration Structure

The most significant change is the consolidation of `llm` and `templating` modules into a single `promptTemplating` module as `model` and `prompt` properties respectively.

**v1:**
```typescript
const config = {
  llm: {
    model_name: 'gpt-4o',
    model_params: {}
  },
  templating: {
    template: [
      { role: 'user', content: 'What is the capital of {{?country}}?' }
    ]
  }
};
```

**v2:**
```typescript
const config = {
  promptTemplating: {
    model: {
      name: 'gpt-4o',
      params: {}
    },
    prompt: {
      template: [
        { role: 'user', content: 'What is the capital of {{?country}}?' }
      ]
    }
  }
};
```

#### Parameter Name Changes

Several parameter names have been updated for consistency.

##### Input Parameters
**v1:**
```typescript
orchestrationClient.chatCompletion({
  inputParams: { country: 'France' }
});
```

**v2:**
```typescript
orchestrationClient.chatCompletion({
  placeholderValues: { country: 'France' }
});
```

##### Model Configuration
**v1:**
```typescript
llm: {
  model_name: 'gpt-4o',
  model_params: { temperature: 0.7 }
}
```

**v2:**
```typescript
promptTemplating: {
  model: {
    name: 'gpt-4o',
    params: { temperature: 0.7 }
  }
}
```

#### Global Streaming Configuration

The global streaming configuration has been updated to use an `enabled` flag instead of a top-level `stream` property.

**v1:**
```typescript
const config = {
  stream: true,
  streamOptions: {
    llm: { include_usage: true }
  }
};
```

**v2:**
```typescript
const config = {
  streamOptions: {
    enabled: true,
    promptTemplating: { include_usage: true }
  }
};
```

#### Response Structure Changes

The response structure has been updated with new property names.

**v1:**
```typescript
// Response properties
response.orchestration_result
response.module_results
```

**v2:**
```typescript
// Response properties
response.final_result
response.intermediate_results
```

#### Grounding Configuration

The grounding configuration structure has been updated to use `placeholders` instead of separate `input_params` and `output_param`.

**v1:**
```typescript
buildDocumentGroundingConfig({
  input_params: ['groundingInput'],
  output_param: 'groundingOutput',
  filters: [...]
});
```

**v2:**
```typescript
buildDocumentGroundingConfig({
  placeholders: {
    input: ['groundingInput'],
    output: 'groundingOutput'
  },
  filters: [...]
});
```

#### Removed Functions

The deprecated `buildAzureContentFilter()` function has been removed in v2.
Use `buildAzureContentSafetyFilter()` instead.

**v1:**
```typescript
// This function is deprecated and removed in v2
const filter = buildAzureContentFilter({
  Hate: 'ALLOW_SAFE',
  Violence: 'ALLOW_SAFE_LOW_MEDIUM'
});
```

**v2:**
```typescript
// Use this function instead
const filter = buildAzureContentSafetyFilter('input', { // For output filter, use type 'output'
  hate: 'ALLOW_SAFE',
  violence: 'ALLOW_SAFE_LOW_MEDIUM'
});
```

#### Azure Content Filter Changes

The `buildAzureContentSafetyFilter()` function now requires a `type` parameter as the first argument to distinguish between input and output filter configurations.
Additionally, the Azure content filter property names have been updated to use lowercase with underscores.

**v1:**
```typescript
buildAzureContentSafetyFilter({
  Hate: 'ALLOW_SAFE',
  SelfHarm: 'ALLOW_SAFE_LOW',
  Sexual: 'ALLOW_SAFE_LOW_MEDIUM',
  Violence: 'ALLOW_ALL'
});
```

**v2:**
```typescript
// For input filters
buildAzureContentSafetyFilter('input', {
  hate: 'ALLOW_SAFE',
  self_harm: 'ALLOW_SAFE_LOW',
  sexual: 'ALLOW_SAFE_LOW_MEDIUM',
  violence: 'ALLOW_ALL'
});

// For output filters
buildAzureContentSafetyFilter('output', {
  hate: 'ALLOW_SAFE',
  self_harm: 'ALLOW_SAFE_LOW',
  sexual: 'ALLOW_SAFE_LOW_MEDIUM',
  violence: 'ALLOW_ALL'
});
```
#### Llama Guard Filter Changes

The `buildLlamaGuardFilter()` function has been renamed to `buildLlamaGuard38BFilter()` function.
It now requires a `type` parameter as the first argument to distinguish between `input` and `output` filter configurations, and accepts categories as an array instead of individual parameters.

**v1:**
```typescript
buildLlamaGuardFilter('self_harm');
```

**v2:**
```typescript
// For input filters
buildLlamaGuard38BFilter('input', ['self_harm', 'violence']);

// For output filters
buildLlamaGuard38BFilter('output', ['self_harm', 'violence']);
```

#### Translation Configuration Changes

The `buildTranslationConfig()` function now requires a `type` parameter as the first argument to distinguish between input and output translation configurations.

**v1:**
```typescript
buildTranslationConfig({
  sourceLanguage: 'en-US',
  targetLanguage: 'de-DE'
});
```

**v2:**
```typescript
// For input translation
buildTranslationConfig('input', {
  sourceLanguage: 'en-US',
  targetLanguage: 'de-DE'
});

// For output translation
buildTranslationConfig('output', {
  sourceLanguage: 'de-DE',
  targetLanguage: 'fr-FR'
});
```

### `@sap-ai-sdk/langchain`

#### Configuration Structure

The LangChain orchestration configuration follows the same structural changes as the core orchestration package.

**v1:**
```typescript
const config: LangChainOrchestrationModuleConfig = {
  llm: {
    model_name: 'gpt-4o',
    model_params: {}
  },
  templating: {
    template: messages
  }
};
```

**v2:**
```typescript
const config: LangChainOrchestrationModuleConfig = {
  promptTemplating: {
    model: {
      name: 'gpt-4o',
      params: {}
    },
    prompt: {
      template: messages
    }
  }
};
```

#### Parameter Changes

Input parameters for LangChain orchestration calls have been updated.

**v1:**
```typescript
await orchestrationClient.invoke(messages, {
  inputParams: { country: 'France' }
});
```

**v2:**
```typescript
await orchestrationClient.invoke(messages, {
  placeholderValues: { country: 'France' }
});
```

#### Response Property Changes

LangChain message responses now use updated property names for intermediate results.

**v1:**
```typescript
// Access module results in response
message.additional_kwargs.module_results
```

**v2:**
```typescript
// Access intermediate results in response
message.additional_kwargs.intermediate_results
