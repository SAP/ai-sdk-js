# @sap-ai-sdk/langchain

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
