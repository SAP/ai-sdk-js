---
'@sap-ai-sdk/langchain': patch
---

[fix] Skip tool and assistant messages when applying `cache_control`, using the last applicable message (system, user, or developer) instead.
Some models do not support `cache_control` on `tool` messages.
