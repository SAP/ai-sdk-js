---
"@sap-ai-sdk/orchestration": minor
---

[feat] Added `configOverride` field to `OrchestrationConfigRef` to pass a `PartialOrchestrationConfig` that overrides parts of the stored orchestration config at request time.
Streaming via `.stream()` now automatically sets `stream.enabled = true` in the partial config override, so config-ref clients no longer require streaming to be pre-configured in the stored config.
  