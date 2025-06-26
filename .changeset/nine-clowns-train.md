---
'@sap-ai-sdk/langchain': minor
---

[Compatibility Note] Adjust content of chat result in LangChain Orchestration by removing `finish_reason`, `index`, `function_call`, `request_id` from `additional_kwargs` and adding `tool_calls` and `request_id` in `generationInfo`.`
