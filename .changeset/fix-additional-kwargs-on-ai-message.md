---
'@sap-ai-sdk/langchain': patch
---

Fix `additional_kwargs` (including `tool_calls`, `intermediate_results`, and `reasoning_content`) being incorrectly placed on the generation object instead of the `AIMessage`, where it was previously inaccessible to users.
