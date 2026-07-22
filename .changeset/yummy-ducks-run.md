---
'@sap-ai-sdk/orchestration': patch
---

[Fix] Automatically route `messages` to `messages_history` to bypass prompt templating when no `prompt` is configured or a `TemplateRef` is used.
Routing is skipped when `placeholderValues` are provided or a prompt with `template` or `tools` is set.
