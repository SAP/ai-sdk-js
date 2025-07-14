# @sap-ai-sdk/foundation-models

## 1.16.0

### Minor Changes

- e9c19b4: [New Functionality] Support Azure OpenAI streaming with tool calls.

### Patch Changes

- @sap-ai-sdk/ai-api@1.16.0
- @sap-ai-sdk/core@1.16.0

## 1.15.0

### Patch Changes

- Updated dependencies [5307dd0]
  - @sap-ai-sdk/core@1.15.0
  - @sap-ai-sdk/ai-api@1.15.0

## 1.14.0

### Patch Changes

- @sap-ai-sdk/ai-api@1.14.0
- @sap-ai-sdk/core@1.14.0

## 1.13.0

### Patch Changes

- 8130838: [Fixed Issue] Remove incorrect error logging if finish reason is null in the streaming chunk.
- Updated dependencies [a6ba3af]
  - @sap-ai-sdk/core@1.13.0
  - @sap-ai-sdk/ai-api@1.13.0

## 1.12.0

### Patch Changes

- @sap-ai-sdk/ai-api@1.12.0
- @sap-ai-sdk/core@1.12.0

## 1.11.0

### Patch Changes

- Updated dependencies [627a152]
  - @sap-ai-sdk/core@1.11.0
  - @sap-ai-sdk/ai-api@1.11.0

## 1.10.0

### Patch Changes

- Updated dependencies [6f28f47]
  - @sap-ai-sdk/core@1.10.0
  - @sap-ai-sdk/ai-api@1.10.0

## 1.9.0

### Patch Changes

- Updated dependencies [bfed500]
  - @sap-ai-sdk/ai-api@1.9.0
  - @sap-ai-sdk/core@1.9.0

## 1.8.0

### Minor Changes

- 09b0d2d: [Fixed Issue] Consider destination when resolving deployment ids.

### Patch Changes

- Updated dependencies [09b0d2d]
- Updated dependencies [1731104]
  - @sap-ai-sdk/ai-api@1.8.0
  - @sap-ai-sdk/core@1.8.0

## 1.7.0

### Patch Changes

- @sap-ai-sdk/ai-api@1.7.0
- @sap-ai-sdk/core@1.7.0

## 1.6.0

### Patch Changes

- @sap-ai-sdk/ai-api@1.6.0
- @sap-ai-sdk/core@1.6.0

## 1.5.0

### Minor Changes

- b4a5506: [New Functionality] Add support for providing custom destination for AI Core besides using environment variable and service binding.

### Patch Changes

- Updated dependencies [b4a5506]
  - @sap-ai-sdk/ai-api@1.5.0
  - @sap-ai-sdk/core@1.5.0

## 1.4.0

### Minor Changes

- d79cee8: [New Functionality] Support streaming chat completion in the Azure OpenAI client in `foundation-models`.

### Patch Changes

- @sap-ai-sdk/ai-api@1.4.0
- @sap-ai-sdk/core@1.4.0

## 1.3.0

### Patch Changes

- 91df549: [Fixed Issue] Get choice via index by comparing the `index` property instead of using array index.
  - @sap-ai-sdk/ai-api@1.3.0
  - @sap-ai-sdk/core@1.3.0

## 1.2.0

### Minor Changes

- 99498cd: [New Functionality] Add convenience method to access all embeddings in an Azure OpenAI response (`AzureOpenAiEmbeddingResponse`).
- 99498cd: [Compatibility Note] Adjust `AzureOpenAiEmbeddingOutput` type to include multiple embedding responses as opposed to one.

### Patch Changes

- @sap-ai-sdk/ai-api@1.2.0
- @sap-ai-sdk/core@1.2.0

## 1.1.0

### Minor Changes

- 771f986: [Fixed Issue] Fix sending the correct resource group headers when custom resource group is set.

### Patch Changes

- 3cbfdc7: [Fixed Issue] Fix index-based data access in embedding response.
  Previously, the 0th index data was always returned.
- 506a1e4: [Fixed Issue] Fix missing and unused dependencies.
- Updated dependencies [506a1e4]
- Updated dependencies [5bd2e4d]
- Updated dependencies [5bd2e4d]
- Updated dependencies [771f986]
- Updated dependencies [5bd2e4d]
  - @sap-ai-sdk/ai-api@1.1.0
  - @sap-ai-sdk/core@1.1.0

## 1.0.0

### Major Changes

- ba9133b: [New Functionality] Offer an OpenAI client to consume Azure OpenAI models for chat completion and embeddings via generative AI hub of SAP AI Core.

### Patch Changes

- Updated dependencies [ba9133b]
  - @sap-ai-sdk/ai-api@1.0.0
  - @sap-ai-sdk/core@1.0.0

## 0.1.0

### Patch Changes

- Updated dependencies [4d5edc7]
  - @sap-ai-sdk/core@0.1.0
  - @sap-ai-sdk/ai-api@0.1.0
