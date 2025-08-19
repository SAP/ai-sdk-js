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

#### Type Import Changes

Generated types are no longer exported from `@sap-ai-sdk/foundation-models`.
For frequently used types in most cases, they remain available from the public exports.
For edge cases where the underlying generated types are used, they must be imported from `@sap-ai-sdk/foundation-models/internal.js`.

```diff
// Generated types must be imported from internal
import type { 
  AzureOpenAiCreateChatCompletionRequest,
  AzureOpenAiCreateChatCompletionResponse 
- } from '@sap-ai-sdk/foundation-models';
+ } from '@sap-ai-sdk/foundation-models/internal.js';
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

```diff
- import type { AzureOpenAiCreateChatCompletionRequest } from '@sap-ai-sdk/foundation-models';
+ import type { AzureOpenAiChatCompletionParameters } from '@sap-ai-sdk/foundation-models';

- const request: AzureOpenAiCreateChatCompletionRequest = {
+ const request: AzureOpenAiChatCompletionParameters = {
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

#### Type Import Changes

Generated types are no longer exported from `@sap-ai-sdk/orchestration`.
For frequently used types in most cases, they remain available from the public exports.
For edge cases where the underlying generated types are used, they must be imported from `@sap-ai-sdk/orchestration/internal.js`.

```diff
// Generated types must be imported from internal
import type { 
  CompletionPostResponse,
  LlmChoice 
- } from '@sap-ai-sdk/orchestration';
+ } from '@sap-ai-sdk/orchestration/internal.js';
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

The most significant change is the consolidation of `llm` and `templating` modules into a single `promptTemplating` module.

```diff
const config = {
- llm: {
-   model_name: 'gpt-4o',
-   model_params: {}
- },
- templating: {
-   template: [
-     { role: 'user', content: 'What is the capital of {{?country}}?' }
-   ]
- }
+ promptTemplating: {
+   model: {
+     name: 'gpt-4o',
+     params: {}
+   },
+   prompt: {
+     template: [
+       { role: 'user', content: 'What is the capital of {{?country}}?' }
+     ]
+   }
+ }
};
```

#### Parameter Name Changes

Several parameter names have been updated for consistency.

##### Input Parameters

```diff
orchestrationClient.chatCompletion({
- inputParams: { country: 'France' }
+ placeholderValues: { country: 'France' }
});
```

##### Model Configuration

```diff
- llm: {
-   model_name: 'gpt-4o',
-   model_params: { temperature: 0.7 }
- }
+ promptTemplating: {
+   model: {
+     name: 'gpt-4o',
+     params: { temperature: 0.7 }
+   }
+ }
```

#### Global Streaming Configuration

The global streaming configuration has been updated to use an `enabled` flag instead of a top-level `stream` property.

```diff
const config = {
- stream: true,
  streamOptions: {
-   llm: { include_usage: true }
+   enabled: true,
+   promptTemplating: { include_usage: true }
  }
};
```

#### Response Structure Changes

The response structure has been updated with new property names.

```diff
// Response properties
- response.orchestration_result
- response.module_results
+ response.final_result
+ response.intermediate_results
```

#### Grounding Configuration

The grounding configuration structure has been updated to use `placeholders` instead of separate `input_params` and `output_param`.

```diff
buildDocumentGroundingConfig({
- input_params: ['groundingInput'],
- output_param: 'groundingOutput',
+ placeholders: {
+   input: ['groundingInput'],
+   output: 'groundingOutput'
+ },
  filters: [...]
})
```

#### Removed Functions

The deprecated `buildAzureContentFilter()` function has been removed in v2.
Use `buildAzureContentSafetyFilter()` instead.

```diff
- // This function is deprecated and removed in v2
- const filter = buildAzureContentFilter({
-   Hate: 'ALLOW_SAFE',
-   Violence: 'ALLOW_SAFE_LOW_MEDIUM'
- });
+ // Use this function instead
+ const filter = buildAzureContentSafetyFilter({
+   hate: 'ALLOW_SAFE',
+   violence: 'ALLOW_SAFE_LOW_MEDIUM'
+ });
```

#### Azure Content Filter Changes

The Azure content filter property names have been updated to use lowercase with underscores.

```diff
buildAzureContentSafetyFilter({
- Hate: 'ALLOW_SAFE',
- SelfHarm: 'ALLOW_SAFE_LOW',
- Sexual: 'ALLOW_SAFE_LOW_MEDIUM',
- Violence: 'ALLOW_ALL'
+ hate: 'ALLOW_SAFE',
+ self_harm: 'ALLOW_SAFE_LOW',
+ sexual: 'ALLOW_SAFE_LOW_MEDIUM',
+ violence: 'ALLOW_ALL'
})
```

### `@sap-ai-sdk/langchain`

#### Configuration Structure

The LangChain orchestration configuration follows the same structural changes as the core orchestration package.

```diff
const config: LangChainOrchestrationModuleConfig = {
- llm: {
-   model_name: 'gpt-4o',
-   model_params: {}
- },
- templating: {
-   template: messages
- }
+ promptTemplating: {
+   model: {
+     name: 'gpt-4o',
+     params: {}
+   },
+   prompt: {
+     template: messages
+   }
+ }
};
```

#### Parameter Changes

Input parameters for LangChain orchestration calls have been updated.

```diff
await orchestrationClient.invoke(messages, {
- inputParams: { country: 'France' }
+ placeholderValues: { country: 'France' }
});
```

#### Response Property Changes

LangChain message responses now use updated property names for intermediate results.

```diff
- // Access module results in response
- message.additional_kwargs.module_results
+ // Access intermediate results in response
+ message.additional_kwargs.intermediate_results
```
