---
'@sap-ai-sdk/orchestration': minor
---

[feat] Add reasoning content support to the Orchestration client.
`ReasoningBlock` type and `reasoning_content` field are added to request, response, and streaming delta types.
`getReasoningContent()` and `getDeltaReasoningContent()` convenience functions return the reasoning text from model responses.
Reasoning blocks can be supplied in `AssistantChatMessage.reasoning_content` for multi-turn conversations.
