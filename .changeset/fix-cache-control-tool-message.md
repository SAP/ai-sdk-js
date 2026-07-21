---
'@sap-ai-sdk/langchain': patch
---

Fix HTTP 400 when `cache_control` is used and the last message is a tool result. The SDK no longer applies `cache_control` to tool messages, as the Orchestration service requires tool message content to remain a plain string.
