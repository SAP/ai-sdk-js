---
'@sap-ai-sdk/orchestration': patch
---

[Fix] Automatically route all `messages` to `messages_history` to bypass prompt templating when no `prompt` is configured or a `TemplateRef` is used.
Routing is skipped when a `Template` is configured or `placeholderValues` are provided.

