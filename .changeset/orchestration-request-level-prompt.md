---
"@sap-ai-sdk/orchestration": minor
---

[feat] Add a request-level `prompt` field to `chatCompletion()` and `stream()`, accepting an inline prompt template or a `TemplateRef` per call.
A request-level `prompt` takes precedence over any constructor prompt and drives message routing for that call.
It cannot be combined with a constructor prompt or with the `messages` field, and setting either combination throws.
