---
'@sap-ai-sdk/langchain': patch
---

[fix] Additional `additional_kwargs` properties (including `tool_calls`, `intermediate_results`, and `reasoning_content`) are now correctly placed on the `AIMessage` instead of the generation object.
