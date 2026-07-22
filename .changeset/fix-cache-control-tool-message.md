---
'@sap-ai-sdk/langchain': patch
---

[fix] Fix https? 400 when `cache_control` is used and the last message is a tool result.
The SDK now skips tool and assistant messages when applying `cache_control`, finding the last applicable message (system, user, or developer) instead.
