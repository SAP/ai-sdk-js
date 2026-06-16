---
'@sap-ai-sdk/orchestration': patch
---

[docs] Document that model parameters, `tools`, and `response_format` must be configured in the constructor and are not accepted in `chatCompletion()`. Clarify that `tool_choice` is not supported by the Orchestration Service and that a new `OrchestrationClient` instance is required to change configuration per request.
