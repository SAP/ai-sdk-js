---
'@sap-ai-sdk/langchain': minor
---

Support reasoning content round-trip in the LangChain orchestration client. Reasoning blocks from assistant messages are now forwarded back to the API in `reasoning_content` (preserving the `signature` for encrypted thinking), and reasoning is stripped from `content` before sending to avoid API conflicts.
