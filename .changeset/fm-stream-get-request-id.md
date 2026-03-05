---
'@sap-ai-sdk/foundation-models': minor
---

[feat] Add `getRequestId()` method to `AzureOpenAiChatCompletionResponse`, `AzureOpenAiChatCompletionStreamResponse` and `AzureOpenAiEmbeddingResponse`.
The new method retrieves the request ID from the `x-aicore-request-id` response header, useful for debugging and tracking requests.
