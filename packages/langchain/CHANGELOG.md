# @sap-ai-sdk/langchain

## 2.6.0

### Patch Changes

- Updated dependencies [f3b6dc5]
  - @sap-ai-sdk/orchestration@2.6.0
  - @sap-ai-sdk/ai-api@2.6.0
  - @sap-ai-sdk/core@2.6.0
  - @sap-ai-sdk/foundation-models@2.6.0

## 2.5.0

### Minor Changes

- 5b88f6f: [Compatibility Note] The `@langchain/core` package is now a peer dependency.
  You now have to install the `@langchain/core` package as a direct dependency of your project.
- b91e0a7: [feat] Support disabling streaming completely via the langchain option `disableStreaming`.
- b91e0a7: [feat] Support auto-streaming via the langchain option `streaming`. When enabled (e.g., transparently by LangGraph), responses are automatically streamed in `invoke()` calls.
- 5b88f6f: [Improvement] Move the `@langchain/core` package from dependencies to peer dependencies.
  This reduces the chance of version incompatibilities between langchain-related packages.

### Patch Changes

- 9ff7cec: [Fix] Pin `@langchain/core` to v1.1.8 to avoid a regression.
- Updated dependencies [2f19a40]
  - @sap-ai-sdk/orchestration@2.5.0
  - @sap-ai-sdk/ai-api@2.5.0
  - @sap-ai-sdk/core@2.5.0
  - @sap-ai-sdk/foundation-models@2.5.0

## 2.4.0

### Patch Changes

- Updated dependencies [aa097da]
- Updated dependencies [2e1d2c2]
  - @sap-ai-sdk/orchestration@2.4.0
  - @sap-ai-sdk/core@2.4.0
  - @sap-ai-sdk/ai-api@2.4.0
  - @sap-ai-sdk/foundation-models@2.4.0

## 2.3.0

### Minor Changes

- 7c9605d: [Compatibility Note] `zod` was upgraded to v4
- 7c9605d: [feat] Bump langchain to v1

### Patch Changes

- Updated dependencies [7c9605d]
- Updated dependencies [485e21b]
  - @sap-ai-sdk/orchestration@2.3.0
  - @sap-ai-sdk/ai-api@2.3.0
  - @sap-ai-sdk/core@2.3.0
  - @sap-ai-sdk/foundation-models@2.3.0

## 2.2.0

### Minor Changes

- 6100bca: [Compatibility Note] Remove structured ouput handling for deprecated gpt-4 & gpt-3 models

### Patch Changes

- Updated dependencies [6100bca]
- Updated dependencies [5225275]
- Updated dependencies [347eac1]
- Updated dependencies [58464e9]
  - @sap-ai-sdk/orchestration@2.2.0
  - @sap-ai-sdk/core@2.2.0
  - @sap-ai-sdk/ai-api@2.2.0
  - @sap-ai-sdk/foundation-models@2.2.0

## 2.1.0

### Patch Changes

- Updated dependencies [0cf7d80]
- Updated dependencies [0cf7d80]
  - @sap-ai-sdk/core@2.1.0
  - @sap-ai-sdk/orchestration@2.1.0
  - @sap-ai-sdk/ai-api@2.1.0
  - @sap-ai-sdk/foundation-models@2.1.0

## 2.0.0

### Major Changes

- 86e6370: [Compatibility Note] Major breaking changes for LangChain orchestration v2:
  - Update LangChain orchestration configuration structure to use `promptTemplating` instead of separate `llm` and `templating` properties.
  - Replace `llm.model_name` with `promptTemplating.model.name` and `llm.model_params` with `promptTemplating.model.params`.
  - The `templating.template` property is now `promptTemplating.prompt.template`.
  - Rename `inputParams` parameter to `placeholderValues` in LangChain orchestration client methods.
  - Update message response property names from `module_results` to `intermediate_results` in additional kwargs.

### Patch Changes

- 5c52cb6: [Compatibility Note] Update imports to use new API facade from foundation-models package.
  - Some generated types now need to be imported from `@sap-ai-sdk/foundation-models/internal.js` instead of `@sap-ai-sdk/foundation-models`.
  - Update to use new `AzureOpenAiChatCompletionParameters` type to replace `AzureOpenAiCreateChatCompletionRequest` which is no longer exported publicly.
- Updated dependencies [5c52cb6]
- Updated dependencies [5c52cb6]
- Updated dependencies [740ba78]
- Updated dependencies [4c00c27]
- Updated dependencies [500c0dd]
- Updated dependencies [9e1c43a]
- Updated dependencies [0a418d0]
- Updated dependencies [740ba78]
- Updated dependencies [5c52cb6]
- Updated dependencies [5c52cb6]
- Updated dependencies [5c52cb6]
- Updated dependencies [5c52cb6]
- Updated dependencies [997e8ec]
- Updated dependencies [997e8ec]
- Updated dependencies [5c52cb6]
- Updated dependencies [86e6370]
- Updated dependencies [14745de]
  - @sap-ai-sdk/orchestration@2.0.0
  - @sap-ai-sdk/foundation-models@2.0.0
  - @sap-ai-sdk/core@2.0.0
  - @sap-ai-sdk/ai-api@2.0.0

## 1.17.0

### Minor Changes

- 8bb24c3: [feat] Support `withStructuredOutput()` method in OpenAI LangChain client.

### Patch Changes

- 8d54af6: [fix] Use `isInteropZodSchema` instead of `isZodSchemaV4` in LangChain Azure OpenAI and Orchestration clients to support both Zod v3 and v4 schemas.
- Updated dependencies [fab35bc]
- Updated dependencies [225f40c]
  - @sap-ai-sdk/orchestration@1.17.0
  - @sap-ai-sdk/ai-api@1.17.0
  - @sap-ai-sdk/core@1.17.0
  - @sap-ai-sdk/foundation-models@1.17.0

## 1.16.0

### Minor Changes

- e9c19b4: [New Functionality] Support LangChain OpenAI streaming.
- 268c38e: [Fixed Issue] Retry on timeout for non-streaming requests in LangChain Orchestration client.
- e9c19b4: [Compatibility Note] Adjust content of chat result in LangChain Orchestration by removing `finish_reason`, `index`, `function_call`, `request_id` from `additional_kwargs` and adding `tool_calls` and `request_id` in `generationInfo`.`

### Patch Changes

- Updated dependencies [9a0d6f7]
- Updated dependencies [e9c19b4]
- Updated dependencies [9a0d6f7]
- Updated dependencies [9a0d6f7]
  - @sap-ai-sdk/orchestration@1.16.0
  - @sap-ai-sdk/foundation-models@1.16.0
  - @sap-ai-sdk/ai-api@1.16.0
  - @sap-ai-sdk/core@1.16.0

## 1.15.0

### Minor Changes

- 4474313: [New Functionality] Support `bindTools()` method in Orchestration LangChain client.

### Patch Changes

- Updated dependencies [5307dd0]
  - @sap-ai-sdk/core@1.15.0
  - @sap-ai-sdk/ai-api@1.15.0
  - @sap-ai-sdk/foundation-models@1.15.0
  - @sap-ai-sdk/orchestration@1.15.0

## 1.14.0

### Minor Changes

- fa1e3fe: [New Functionality] Support streaming in LangChain orchestration client.
- fa1e3fe: [New Functionality] Support `bindTools()` method in Azure OpenAI LangChain client.

### Patch Changes

- Updated dependencies [fa1e3fe]
- Updated dependencies [fa1e3fe]
- Updated dependencies [fa1e3fe]
- Updated dependencies [fa1e3fe]
- Updated dependencies [fa1e3fe]
- Updated dependencies [fa1e3fe]
- Updated dependencies [c62253f]
  - @sap-ai-sdk/orchestration@1.14.0
  - @sap-ai-sdk/ai-api@1.14.0
  - @sap-ai-sdk/core@1.14.0
  - @sap-ai-sdk/foundation-models@1.14.0

## 1.13.0

### Patch Changes

- Updated dependencies [8130838]
- Updated dependencies [a6ba3af]
  - @sap-ai-sdk/foundation-models@1.13.0
  - @sap-ai-sdk/core@1.13.0
  - @sap-ai-sdk/ai-api@1.13.0
  - @sap-ai-sdk/orchestration@1.13.0

## 1.12.0

### Minor Changes

- 5360c8c: [Compatibility Note] Use `LangchainOrchestrationModuleConfig` to type the configuration object passed to the LangChain orchestration client.

### Patch Changes

- Updated dependencies [5360c8c]
  - @sap-ai-sdk/orchestration@1.12.0
  - @sap-ai-sdk/ai-api@1.12.0
  - @sap-ai-sdk/core@1.12.0
  - @sap-ai-sdk/foundation-models@1.12.0

## 1.11.0

### Minor Changes

- 3f8bd81: [New Functionality] Support using data masking in LangChain orchestration client.
- e1f2b5a: [New Functionality] Support using content filtering in LangChain orchestration client.

### Patch Changes

- Updated dependencies [627a152]
- Updated dependencies [a8d05b0]
- Updated dependencies [264c5b0]
  - @sap-ai-sdk/core@1.11.0
  - @sap-ai-sdk/orchestration@1.11.0
  - @sap-ai-sdk/ai-api@1.11.0
  - @sap-ai-sdk/foundation-models@1.11.0

## 1.10.0

### Patch Changes

- Updated dependencies [6f28f47]
  - @sap-ai-sdk/core@1.10.0
  - @sap-ai-sdk/ai-api@1.10.0
  - @sap-ai-sdk/foundation-models@1.10.0
  - @sap-ai-sdk/orchestration@1.10.0

## 1.9.0

### Minor Changes

- a45dc06: [New Functionality] Add LangChain Orchestration client.

### Patch Changes

- Updated dependencies [bc51f59]
- Updated dependencies [bfed500]
- Updated dependencies [84175fb]
  - @sap-ai-sdk/orchestration@1.9.0
  - @sap-ai-sdk/ai-api@1.9.0
  - @sap-ai-sdk/core@1.9.0
  - @sap-ai-sdk/foundation-models@1.9.0

## 1.8.0

### Minor Changes

- cd06f2a: [Fixed Issue] Add `tool_calls` array to assistant messages only when it is not empty.

### Patch Changes

- Updated dependencies [09b0d2d]
- Updated dependencies [1731104]
  - @sap-ai-sdk/foundation-models@1.8.0
  - @sap-ai-sdk/ai-api@1.8.0
  - @sap-ai-sdk/core@1.8.0

## 1.7.0

### Minor Changes

- ccfa2eb: [Fixed Issue] Fixed the internal mapping of LangChain to Azure OpenAI and vice versa.

### Patch Changes

- @sap-ai-sdk/ai-api@1.7.0
- @sap-ai-sdk/core@1.7.0
- @sap-ai-sdk/foundation-models@1.7.0

## 1.6.0

### Patch Changes

- @sap-ai-sdk/ai-api@1.6.0
- @sap-ai-sdk/core@1.6.0
- @sap-ai-sdk/foundation-models@1.6.0

## 1.5.0

### Minor Changes

- b4a5506: [New Functionality] Add support for providing custom destination for AI Core besides using environment variable and service binding.

### Patch Changes

- Updated dependencies [b4a5506]
  - @sap-ai-sdk/foundation-models@1.5.0
  - @sap-ai-sdk/ai-api@1.5.0
  - @sap-ai-sdk/core@1.5.0

## 1.4.0

### Patch Changes

- Updated dependencies [d79cee8]
  - @sap-ai-sdk/foundation-models@1.4.0
  - @sap-ai-sdk/ai-api@1.4.0
  - @sap-ai-sdk/core@1.4.0

## 1.3.0

### Patch Changes

- Updated dependencies [91df549]
  - @sap-ai-sdk/foundation-models@1.3.0
  - @sap-ai-sdk/ai-api@1.3.0
  - @sap-ai-sdk/core@1.3.0

## 1.2.0

### Patch Changes

- 99498cd: [Fixed Issue] Fix performance issues when creating embeddings for split documents by sending all documents in one request instead of splitting it up in separate requests.
- Updated dependencies [99498cd]
- Updated dependencies [99498cd]
  - @sap-ai-sdk/foundation-models@1.2.0
  - @sap-ai-sdk/ai-api@1.2.0
  - @sap-ai-sdk/core@1.2.0

## 1.1.0

### Minor Changes

- 771f986: [Fixed Issue] Fix sending the correct resource group headers when custom resource group is set.

### Patch Changes

- 5a977da: [Fixed Issue] Fix auto completion for Azure OpenAI Embedding models.
- 506a1e4: [Fixed Issue] Fix missing and unused dependencies.
- 8cda2de: [Fixed Issue] Fix LangChain types for proper IDE auto completion.
- Updated dependencies [3cbfdc7]
- Updated dependencies [506a1e4]
- Updated dependencies [5bd2e4d]
- Updated dependencies [5bd2e4d]
- Updated dependencies [771f986]
- Updated dependencies [5bd2e4d]
  - @sap-ai-sdk/foundation-models@1.1.0
  - @sap-ai-sdk/ai-api@1.1.0
  - @sap-ai-sdk/core@1.1.0

## 1.0.0

### Major Changes

- ba9133b: [New Functionality] Support using the [LangChain](https://js.langchain.com/v0.2/docs/tutorials/) framework for consuming Azure OpenAI models from generative AI hub of SAP AI Core.

### Patch Changes

- Updated dependencies [ba9133b]
- Updated dependencies [ba9133b]
  - @sap-ai-sdk/foundation-models@1.0.0
  - @sap-ai-sdk/ai-api@1.0.0
