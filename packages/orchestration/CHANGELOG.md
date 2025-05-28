# @sap-ai-sdk/orchestration

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
