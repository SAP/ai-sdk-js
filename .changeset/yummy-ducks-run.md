---
'@sap-ai-sdk/orchestration': patch
---

[Fix] Automatically route `role: 'tool'` messages (and all preceding messages) from `messages` to `messages_history` to bypass prompt templating, unless placeholder values are provided.
When no `prompt` property is set on the config, all messages are routed to `messages_history`.
