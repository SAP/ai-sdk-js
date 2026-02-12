# @sap-ai-sdk/orchestration

## 2.6.0

### Minor Changes

- f3b6dc5: [Fixed Issue] Export `isConfigReference()` method as a value instead of type-only export.
  This function can now be imported and used at runtime to check if a configuration is an orchestration configuration reference type.

### Patch Changes

- @sap-ai-sdk/ai-api@2.6.0
- @sap-ai-sdk/core@2.6.0
- @sap-ai-sdk/prompt-registry@2.6.0

## 2.5.0

### Minor Changes

- 2f19a40: [New Functionality] Add support for orchestration configuration references in the orchestration client.

### Patch Changes

- @sap-ai-sdk/ai-api@2.5.0
- @sap-ai-sdk/core@2.5.0
- @sap-ai-sdk/prompt-registry@2.5.0

## 2.4.0

### Minor Changes

- aa097da: [New Functionality] Added support for `applyTo` and `translateMessagesHistory` in order to enable selective input translation and automatic inference of target language for output translation parameters.

### Patch Changes

- Updated dependencies [2e1d2c2]
- Updated dependencies [a3cbc6e]
- Updated dependencies [a3cbc6e]
  - @sap-ai-sdk/core@2.4.0
  - @sap-ai-sdk/prompt-registry@2.4.0
  - @sap-ai-sdk/ai-api@2.4.0

## 2.3.0

### Minor Changes

- 7c9605d: [Compatibility Note] `zod` was upgraded to v4
- 485e21b: [New Functionality] Added support for `protected_material_code` property to `buildAzureContentSafetyFilter()` function for output filter configuration to allow detecting protected code content from known github repositories.

### Patch Changes

- Updated dependencies [7c9605d]
  - @sap-ai-sdk/prompt-registry@2.3.0
  - @sap-ai-sdk/ai-api@2.3.0
  - @sap-ai-sdk/core@2.3.0

## 2.2.0

### Minor Changes

- 6100bca: [Improvement] Add `cohere--command-a-reasoning`, `mistralai--mistral-medium-instruct` and perplexity-ai `sonar` and `sonar-pro` to model list
- 347eac1: [New Functionality] Introduce orchestration embedding client for consuming embedding feature of the orchestration service.

### Patch Changes

- Updated dependencies [6100bca]
- Updated dependencies [5225275]
- Updated dependencies [347eac1]
- Updated dependencies [58464e9]
  - @sap-ai-sdk/core@2.2.0
  - @sap-ai-sdk/ai-api@2.2.0
  - @sap-ai-sdk/prompt-registry@2.2.0

## 2.1.0

### Patch Changes

- 0cf7d80: [Fixed Issue] Fix JSDoc example of `buildAzureContentSafetyFilter()` function.
- Updated dependencies [0cf7d80]
  - @sap-ai-sdk/core@2.1.0
  - @sap-ai-sdk/ai-api@2.1.0
  - @sap-ai-sdk/prompt-registry@2.1.0

## 2.0.0

### Major Changes

- 740ba78: [Compatibility Note] `buildTranslationConfig()` function now requires `type` parameter to distinguish between `input` and `output` translation configuration.
- 4c00c27: [Compatibility Note] Change stream method parameter from `AbortController` to `AbortSignal`.
  The `stream()` method now accepts an `AbortSignal` instead of an `AbortController` as the second parameter in both Azure OpenAI and Orchestration clients.
- 740ba78: [Compatibility Note] `buildLlamaGuardFilter()` function has been renamed to `buildLlamaGuard38BFilter()`. It now requires a type parameter to distinguish between `input` and `output` filter configurations, and accepts filter categories as an array.
- 5c52cb6: [Compatibility Note] Move generated types to internal exports while keeping frequently used types in main exports.
  - Generated types are no longer exported from `@sap-ai-sdk/orchestration` and must be imported from `@sap-ai-sdk/orchestration/internal.js` instead.
  - Frequently used types (`ChatMessage`, `SystemChatMessage`, `UserChatMessage`, `AssistantChatMessage`, `ToolChatMessage`, `DeveloperChatMessage`, `ChatCompletionTool`, `FunctionObject`) remain available from main package exports.
- 5c52cb6: [Compatibility Note] Response object `data` property is renamed to `_data`.
  Use getter methods like `getContent()`, `getTokenUsage()`, `getAssistantMessage()` instead of direct data access.
- 997e8ec: [Compatibility Note] `buildAzureContentSafetyFilter()` function now requires `type` parameter to distinguish between `input` and `output` filter configuration.
- 997e8ec: [New Functionality] Add `prompt_shield` property to `buildAzureContentSafetyFilter()` function for input filter configuration to allow enabling prompt attack detection.
- 86e6370: [Compatibility Note] Major breaking changes for orchestration v2:
  - Consolidate `llm` and `templating` modules into a single `promptTemplating` module.
  - The `llm.model_name` property is now `promptTemplating.model.name` and `llm.model_params` is now `promptTemplating.model.params`.
  - The `templating.template` property is now `promptTemplating.prompt.template`.
  - Rename `inputParams` parameter to `placeholderValues` in orchestration client methods.
  - Update response property names from `orchestration_result` to `final_result` and `module_results` to `intermediate_results`.
  - Replace top-level `stream` property with `streamOptions.enabled` and update streaming module options from `llm` to `promptTemplating`.
  - Update grounding configuration to use `placeholders.input` and `placeholders.output` instead of separate `input_params` and `output_param`.
  - Update Azure content filter property names to lowercase with underscores: `Hate` to `hate`, `SelfHarm` to `self_harm`, `Sexual` to `sexual`, and `Violence` to `violence`.
  - Remove deprecated `buildAzureContentFilter()` function and use `buildAzureContentSafetyFilter()` instead.

### Minor Changes

- 5c52cb6: [New Functionality] Add `getIntermediateResults()` method to `OrchestrationResponse`, `OrchestrationStreamResponse`, `OrchestrationStreamChunkResponse` classes for accessing intermediate processing results from orchestration modules.
- 0a418d0: [feat] Add `deploymentId` as the optional parameter for OrchestrationClient initialization.
- 5c52cb6: [New Functionality] Add `findChoiceByIndex()` method to find specific choices by index in streaming responses.

### Patch Changes

- Updated dependencies [500c0dd]
- Updated dependencies [9e1c43a]
- Updated dependencies [14745de]
  - @sap-ai-sdk/core@2.0.0
  - @sap-ai-sdk/ai-api@2.0.0
  - @sap-ai-sdk/prompt-registry@2.0.0

## 1.17.0

### Minor Changes

- fab35bc: [Improvement] Add support for standard and custom DPI entities in `buildDpiMaskingProvider()` function.
  Allow configuration of masking strategies via `replacement_strategy` for both entity types.
- 225f40c: [Improvement] Add utility functions `getContent()`, `getRefusal()`, `getAllMessages()`, `getAssistantMessage()`, and `getResponse()` to stream response.

### Patch Changes

- @sap-ai-sdk/ai-api@1.17.0
- @sap-ai-sdk/core@1.17.0
- @sap-ai-sdk/prompt-registry@1.17.0

## 1.16.0

### Patch Changes

- 9a0d6f7: [Fixed Issue] The `role` property of the `ResponseChatMessage` type is now mandatory as it is always returned.
- 9a0d6f7: [Compatibility Note] The type of `logprobs` in the response is corrected as a result of a bug fix from the Orchestration service.
- 9a0d6f7: [Compatibility Note] The `ModuleResults` and `LlmModuleResult` types are now only meant to be used for the non-streaming case.
  Previously, they represented both streaming and non-streaming response.
  For streaming, use `ModuleResultsStreaming` and `LlmModuleResultStreaming` types instead.
  - @sap-ai-sdk/ai-api@1.16.0
  - @sap-ai-sdk/core@1.16.0
  - @sap-ai-sdk/prompt-registry@1.16.0

## 1.15.0

### Patch Changes

- Updated dependencies [5307dd0]
  - @sap-ai-sdk/core@1.15.0
  - @sap-ai-sdk/ai-api@1.15.0
  - @sap-ai-sdk/prompt-registry@1.15.0

## 1.14.0

### Minor Changes

- fa1e3fe: [New Functionality] Support streaming in LangChain orchestration client.
- fa1e3fe: [New Functionality] Introduce convenience functions `getAllMessages()`, `getAssistantMessage()`, `getToolCalls()` and `getRefusal()` for orchestration.
- fa1e3fe: [New Functionality] Introduce support for tool calls, for both streaming and regular invocation.
- fa1e3fe: [Improvement] Make `templating` and `templating.template` properties optional in the `Prompt` type and introduce a new `messages` property to allow sending messages directly without requiring a template. This enables users to reuse the same client instance without re-initialization by passing updated messages at runtime.
- fa1e3fe: [Compatibility Note] Since `ChatMessage` type is now one of the many specific types such as `SystemChatMessage` and `UserChatMessage` with predefined roles in the orchestration service specification, always define type when creating objects of type `OrchestrationModuleConfig` and `TemplatingModuleConfig` to avoid `role` being any string.
- c62253f: [New Functionality] Add support for orchestration translation module.
  Implement `buildTranslationConfig()` convenience function to build translation config.

### Patch Changes

- fa1e3fe: [New Functionality] Support document grounding with SharePoint and S3 data repositories.
  - @sap-ai-sdk/ai-api@1.14.0
  - @sap-ai-sdk/core@1.14.0
  - @sap-ai-sdk/prompt-registry@1.14.0

## 1.13.0

### Patch Changes

- Updated dependencies [a6ba3af]
  - @sap-ai-sdk/core@1.13.0
  - @sap-ai-sdk/ai-api@1.13.0
  - @sap-ai-sdk/prompt-registry@1.13.0

## 1.12.0

### Minor Changes

- 5360c8c: [New Functionality] Add support for passing a YAML specification as a string to the `templating` property in `OrchestrationModuleConfig`.

### Patch Changes

- @sap-ai-sdk/ai-api@1.12.0
- @sap-ai-sdk/core@1.12.0
- @sap-ai-sdk/prompt-registry@1.12.0

## 1.11.0

### Minor Changes

- a8d05b0: [New Functionality] Introduce `buildDpiMaskingProvider()` convenience function to build masking provider `SAP Data Privacy Integration`.
- 264c5b0: [New Functionality] Support setting `metadata_params` property in `buildDocumentGroundingConfig()` convenience function.

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

### Minor Changes

- bc51f59: [New Functionality] Introduce `buildLlamaGuardFilter()` convenience function to build Llama guard filters.

### Patch Changes

- 84175fb: [Improvement] Update Orchestration to 2502b Release
- Updated dependencies [bfed500]
  - @sap-ai-sdk/ai-api@1.9.0
  - @sap-ai-sdk/core@1.9.0

## 1.8.0

### Minor Changes

- 54a9044: [Compatibility Note] Deprecate `buildAzureContentFilter()` function.
  Use `buildAzureContentSafetyFilter()` function instead.
- 09b0d2d: [Fixed Issue] Consider destination when resolving deployment ids.
- 16d97ab: [New Functionality] Support configuring data masking for grounding inputs.
- 5c248a1: [New Functionality] Support using prompt registry with orchestration client.
- 2c76a1f: [Compatibility Note] Update Orchestration to 2502a Release

### Patch Changes

- Updated dependencies [09b0d2d]
- Updated dependencies [1731104]
  - @sap-ai-sdk/ai-api@1.8.0
  - @sap-ai-sdk/core@1.8.0

## 1.7.0

### Minor Changes

- 0a62553: [Compatibility Note] Update AI API to the 2501a release.
  As part of this change, the `modelsGet` method of `ScenarioAPI` has been renamed to `scenarioQueryModels`.
- f08ac2e: [New Functionality] Support using `help.sap.com` as data repository type in the grounding module.
- bdaae7e: [Fixed Issue] Fix logging bug when using streaming with JSON client.
  [New Functionality] Add `streaming` option in the `OrchestrationModuleConfig` type to set global streaming options.

### Patch Changes

- @sap-ai-sdk/ai-api@1.7.0
- @sap-ai-sdk/core@1.7.0

## 1.6.0

### Minor Changes

- 1da2caa: [New Functionality] Support image recognition for orchestration service.
- d836abf: [New Functionality] Add support for streaming in the orchestration client.
- 1476584: [Improvement] Make `model_params` property in the `LlmModuleConfig` optional and refine the type definition to also include known properties.
- a039890: [Improvement] Add `buildDocumentGroundingConfig()` convenience function to create document grounding configuration in the Orchestration client.

### Patch Changes

- @sap-ai-sdk/ai-api@1.6.0
- @sap-ai-sdk/core@1.6.0

## 1.5.0

### Minor Changes

- 17a1eea: [New Functionality] Add support for using a JSON configuration obtained from AI Launchpad to consume orchestration service.
- b4a5506: [New Functionality] Add support for providing custom destination for AI Core besides using environment variable and service binding.

### Patch Changes

- Updated dependencies [b4a5506]
  - @sap-ai-sdk/ai-api@1.5.0
  - @sap-ai-sdk/core@1.5.0

## 1.4.0

### Minor Changes

- d79cee8: [New Functionality] Add support for grounding capabilities of the orchestration service.

### Patch Changes

- @sap-ai-sdk/ai-api@1.4.0
- @sap-ai-sdk/core@1.4.0

## 1.3.0

### Minor Changes

- bf17e17: [Fixed Issue] Fix input and output filters to disallow additional properties as part of the filter config.

  [Compatibility Note] `FilteringConfig` type has been renamed to `InputFilteringConfig` and `OutputFilteringConfig` for future extensibility.

- 6fe32b8: [Compatibility Note] Switch some of the orchestration interfaces to types, as they were introduced by accident.

  [Compatibility Note] Remove `grounding` key from the type `ModuleResults`.

### Patch Changes

- 91df549: [Fixed Issue] Get choice via index by comparing the `index` property instead of using array index.
  - @sap-ai-sdk/ai-api@1.3.0
  - @sap-ai-sdk/core@1.3.0

## 1.2.0

### Patch Changes

- @sap-ai-sdk/ai-api@1.2.0
- @sap-ai-sdk/core@1.2.0

## 1.1.0

### Minor Changes

- a1105d9: [New Functionality] Add support for the data masking capabilities of the orchestration service.
- 771f986: [Fixed Issue] Fix sending the correct resource group headers when custom resource group is set.

### Patch Changes

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

- ba9133b: [New Functionality] Introduce orchestration client for consuming the following features of the orchestration service:
  - harmonized LLM access via orchestration
  - client side prompt templates
  - content filtering

### Patch Changes

- Updated dependencies [ba9133b]
  - @sap-ai-sdk/ai-api@1.0.0
  - @sap-ai-sdk/core@1.0.0

## 0.1.0

### Patch Changes

- Updated dependencies [4d5edc7]
  - @sap-ai-sdk/core@0.1.0
  - @sap-ai-sdk/ai-api@0.1.0
