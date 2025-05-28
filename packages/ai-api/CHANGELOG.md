# @sap-ai-sdk/ai-api

## 1.13.0

### Patch Changes

- Updated dependencies [a6ba3af]
  - @sap-ai-sdk/core@1.13.0

## 1.12.0

### Patch Changes

- @sap-ai-sdk/core@1.12.0

## 1.11.0

### Patch Changes

- Updated dependencies [627a152]
  - @sap-ai-sdk/core@1.11.0

## 1.10.0

### Patch Changes

- Updated dependencies [6f28f47]
  - @sap-ai-sdk/core@1.10.0

## 1.9.0

### Patch Changes

- bfed500: [Fixed Issue] Add missing cause in the error object for failing HTTP requests by using `ErrorWithCause`, providing more context for debugging.

  [Compatibility Note] Due to the introduction of `ErrorWithCause`, `AxiosError` is now wrapped inside the `cause` property.
  For example, use `error.cause.response.data` instead of `error.response.data` to access the error response from the server.

- Updated dependencies [bfed500]
  - @sap-ai-sdk/core@1.9.0

## 1.8.0

### Minor Changes

- 09b0d2d: [Fixed Issue] Consider destination when resolving deployment ids.
- 1731104: [Compatibility Note] Update AI API spec to 2501b release.
  The `kubesubmitV4GenericSecretsGet` function is renamed to `kubesubmitV4GenericSecretsGetAll`.

### Patch Changes

- @sap-ai-sdk/core@1.8.0

## 1.7.0

### Patch Changes

- @sap-ai-sdk/core@1.7.0

## 1.6.0

### Patch Changes

- @sap-ai-sdk/core@1.6.0

## 1.5.0

### Minor Changes

- b4a5506: [New Functionality] Add support for providing custom destination for AI Core besides using environment variable and service binding.

### Patch Changes

- Updated dependencies [b4a5506]
  - @sap-ai-sdk/core@1.5.0

## 1.4.0

### Patch Changes

- @sap-ai-sdk/core@1.4.0

## 1.3.0

### Patch Changes

- @sap-ai-sdk/core@1.3.0

## 1.2.0

### Patch Changes

- @sap-ai-sdk/core@1.2.0

## 1.1.0

### Minor Changes

- 5bd2e4d: [Compatibility Note] Move `modelsGet()` from `ModelApi` to `ScenarioApi`, and remove `ModelAPI`.
- 5bd2e4d: [Fixed Issue] Fix `AiExecutionModificationResponseList` type to correctly represent an array of responses or errors.
- 771f986: [Fixed Issue] Fix sending the correct resource group headers when custom resource group is set.
- 5bd2e4d: [Improvement] Add `kubesubmitV4ResourceQuotaGetDeploymentQuota()` function in `DeploymentApi` to get details about quota and usage for deployments.
  Additionally introduce two new types `BckndDeploymentQuotaItem` and `BckndDeploymentResourceQuotaResponse`.

### Patch Changes

- 506a1e4: [Fixed Issue] Fix missing and unused dependencies.
- Updated dependencies [506a1e4]
- Updated dependencies [771f986]
  - @sap-ai-sdk/core@1.1.0

## 1.0.0

### Major Changes

- ba9133b: [New Functionality] Provide an HTTP wrapper to consume the [AI Core Rest APIs](https://api.sap.com/api/AI_CORE_API/overview). It is powered by the SAP Cloud SDK OpenAPI generator.

### Patch Changes

- @sap-ai-sdk/core@1.0.0

## 0.1.0

### Patch Changes

- Updated dependencies [4d5edc7]
  - @sap-ai-sdk/core@0.1.0
