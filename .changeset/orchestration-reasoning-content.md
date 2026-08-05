---
'@sap-ai-sdk/orchestration': minor
---

[feat] Add reasoning content support to the Orchestration client.
`reasoning_content` fields were added on response, streaming delta, and assistant message types.
The `getReasoningContent()` and `getDeltaReasoningContent()` convenience functions return the reasoning text from model responses.
