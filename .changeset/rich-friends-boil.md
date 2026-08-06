---
"@sap-ai-sdk/orchestration": minor
---

[feat] Added `overrideConfig` field to `OrchestrationConfigRef` to pass a `PartialOrchestrationConfig` that overrides parts of the stored orchestration configuration at request time.
Streaming via `.stream()` now automatically sets `stream.enabled = true` in the partial configuration override, so clients using a stored orchestration configuration reference no longer require streaming to be pre-configured in the stored configuration.
  