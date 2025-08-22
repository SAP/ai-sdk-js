---
'@sap-ai-sdk/foundation-models': major
---

[Compatibility Note] Move generated types to internal exports while keeping frequently used types in main exports.
- Generated types are no longer exported from `@sap-ai-sdk/foundation-models` and must be imported from `@sap-ai-sdk/foundation-models/internal.js` instead.
- Frequently used types (`AzureOpenAiChatCompletionTool`, `AzureOpenAiFunctionObject`, `AzureOpenAiChatCompletionRequestMessage`, `AzureOpenAiChatCompletionRequestSystemMessage`, `AzureOpenAiChatCompletionRequestUserMessage`, `AzureOpenAiChatCompletionRequestAssistantMessage`, `AzureOpenAiChatCompletionRequestToolMessage`) remain available from main package exports.
- Add new type `AzureOpenAiChatCompletionParameters` to replace `AzureOpenAiCreateChatCompletionRequest` which is no longer exported publicly.
