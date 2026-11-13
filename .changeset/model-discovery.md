---
"@sap-ai-sdk/ai-api": minor
---

[feat] ai-api: add model discovery and deployment resolution helpers.
Introduces `getModels()` to list available Gen AI Hub models, filter helpers (`filterFoundationModelsByCapability`, `filterFoundationModelsNonDeprecated`, `getFoundationModelLatestVersions`), and exposes `getFoundationModelDeploymentId`, `getFoundationModelDeploymentUrl`, `getOrchestrationDeploymentId`, and `getOrchestrationDeploymentUrl` as public APIs.
