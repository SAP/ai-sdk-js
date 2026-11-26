---
'@sap-ai-sdk/orchestration': minor
---

[feat] Add `max_completion_tokens` to `LlmModelParams`.
`max_tokens` is deprecated in favor of `max_completion_tokens`, matching the Orchestration Service spec example.
Existing callers passing `max_tokens` continue to work.
