---
'@sap-ai-sdk/langchain': minor
---

[feat] Add reasoning content support to the LangChain orchestration client. 
Reasoning blocks are surfaced on the `AIMessage` as typed content blocks and in `additional_kwargs.reasoning_content` (preserving the `signature` for encrypted thinking round-trips). 
Reasoning blocks from assistant messages are forwarded back to the API in `reasoning_content` on subsequent turns.
