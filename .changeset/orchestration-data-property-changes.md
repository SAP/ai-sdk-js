---
'@sap-ai-sdk/orchestration': major
---

[Compatibility Note] Response object `data` property is renamed to `_data`.
Use getter methods like `getContent()`, `getTokenUsage()`, `getAssistantMessage()` instead of direct data access.
