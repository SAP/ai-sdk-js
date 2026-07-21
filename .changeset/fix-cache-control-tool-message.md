---
'@sap-ai-sdk/langchain': patch
---

[fix] Fix https? 400 when `cache_control` is used and the last message is a tool result.
The SDK no longer applies `cache_control` to tool messages, as Anthropic models do not support cache breakpoints on tool messages.
