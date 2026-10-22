---
'@sap-ai-sdk/langchain': minor
---

[feat] Add reasoning content support to the Orchestration LangChain client.
Reasoning blocks from model responses are surfaced in `AIMessage.additional_kwargs.reasoning_content`(preserving the `signature` for encrypted thinking), for both non-streaming and streaming responses.
On subsequent turns, reasoning is forwarded back to the Orchestration service in `reasoning_content` from `additional_kwargs.reasoning_content`.
Reasoning placed directly in message `content` is treated as output only and is not forwarded.
