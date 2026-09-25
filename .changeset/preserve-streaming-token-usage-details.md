---
'@sap-ai-sdk/orchestration': patch
---

[fix] Preserve `prompt_tokens_details` and `completion_tokens_details` in streamed token usage to fix missing cache and reasoning token details in `OrchestrationStreamResponse.getTokenUsage()` and `getIntermediateResults()`.
