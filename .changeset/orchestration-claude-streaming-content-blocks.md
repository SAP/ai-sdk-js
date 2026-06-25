---
'@sap-ai-sdk/orchestration': patch
---

[Fix] `getDeltaContent()` now correctly handles Anthropic Claude streaming chunks where `delta.content` is an `Array<{type,text}>` (content blocks) instead of a plain string. Previously, all Claude streaming tokens were silently dropped, causing `handleLLMNewToken` to fire with empty strings on every chunk.
