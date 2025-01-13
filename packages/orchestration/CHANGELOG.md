# @sap-ai-sdk/orchestration

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
