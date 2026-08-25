---
'@sap-ai-sdk/langchain': patch
---

[fix] Normalize invalid tool message content to empty string to prevent AI Core 400 errors when MCP tools return empty results.
