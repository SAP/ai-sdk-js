---
"@sap-ai-sdk/langchain": minor
---

[compat] The LangChain `OrchestrationClient` now routes the current turn through the request-level `prompt` field instead of the deprecated `messages` field.
The `prompt` field on the constructor `promptTemplating` module is deprecated.
Supply the system message or template as part of the message list passed to `invoke`, `stream`, or `_generate` instead.
While a constructor `prompt` is set, the current turn is still forwarded through the deprecated `messages` field for backward compatibility.
