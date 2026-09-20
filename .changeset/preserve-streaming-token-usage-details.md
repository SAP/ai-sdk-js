---
'@sap-ai-sdk/orchestration': patch
---

[fix] Preserve `prompt_tokens_details` and `completion_tokens_details` in token usage when streaming. Merging streamed chunks rebuilt the usage object from only `prompt_tokens`, `completion_tokens` and `total_tokens`, so cache and reasoning token details were dropped from `OrchestrationStreamResponse.getTokenUsage()` and `getIntermediateResults()`.
