---
'@sap-ai-sdk/orchestration': patch
---

[impr] Document that model parameters, `tools`, and `response_format` must be set in the constructor config, not in `chatCompletion()`, and that `tool_choice` is not part of the Orchestration Service template schema but may be passed via `LlmModelParams`.
