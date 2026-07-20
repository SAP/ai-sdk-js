---
'@sap-ai-sdk/orchestration': minor
---

[feat] Support reasoning content in Orchestration request/responses. Add `ReasoningBlock` type and `getReasoningContent()` / `getDeltaReasoningContent()` convenience functions to access model reasoning content in both streaming and non-streaming responses. Reasoning blocks can also be supplied in `AssistantChatMessage.reasoning_content` for multi-turn conversations.
