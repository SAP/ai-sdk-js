---
'@sap-ai-sdk/orchestration': minor
---

[feat] Add `rawHttpResponse` property to `OrchestrationStreamResponse`.
The new property exposes the raw HTTP response from the orchestration service for advanced use cases.
This does not include the SSE stream payload data.
