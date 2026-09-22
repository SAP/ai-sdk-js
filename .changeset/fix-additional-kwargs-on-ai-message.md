---
'@sap-ai-sdk/langchain': patch
---

[fix] Fix `additional_kwargs` (including `tool_calls`, `intermediate_results`, and `reasoning_content`) being incorrectly placed on the generation object instead of the `AIMessage`.
