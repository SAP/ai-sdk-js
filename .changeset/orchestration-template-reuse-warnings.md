---
'@sap-ai-sdk/orchestration': minor
'@sap-ai-sdk/langchain': minor
---

[Improvement] Add warnings for template reuse patterns that can cause duplicate content in multi-turn and agentic workflows.

`OrchestrationClient` now logs a `warn` when messages are passed alongside a `template_ref` or `OrchestrationConfigRef` (they are routed to `messages_history`, not injected into the prompt template), and when the same client instance with an inline prompt template is reused across multiple turns (the template is prepended on every request).
The first call with an inline template logs an `info` to make the prepend behavior visible; subsequent calls log a `warn` recommending the two-client pattern.