---
'@sap-ai-sdk/orchestration': patch
---

[impr] Document that model parameters, `tools`, and `response_format` must be configured in the constructor and are not accepted in `chatCompletion()`. Clarify that `tool_choice` is not part of the Orchestration Service template schema but may be passed via `LlmModelParams`. Document that a new `OrchestrationClient` instance is required to change configuration per request.
