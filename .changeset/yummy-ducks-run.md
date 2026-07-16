---
'@sap-ai-sdk/orchestration': patch
---

[Fix] Automatically route `messages` to `messages_history` to bypass prompt templating when tool results are present (preventing `{{?...}}` syntax in tool content from being interpreted as template placeholders), a `TemplateRef` is used, or no `prompt` is configured.
Routing is skipped when `placeholderValues` are provided.
