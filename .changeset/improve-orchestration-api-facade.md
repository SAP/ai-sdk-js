---
'@sap-ai-sdk/orchestration': major
---

[Compatibility Note] Move generated types to internal exports while keeping frequently used types in main exports.
- Generated types are no longer exported from `@sap-ai-sdk/orchestration` and must be imported from `@sap-ai-sdk/orchestration/internal.js` instead.
- Frequently used types (`ChatMessage`, `SystemChatMessage`, `UserChatMessage`, `AssistantChatMessage`, `ToolChatMessage`, `DeveloperChatMessage`, `ChatCompletionTool`, `FunctionObject`, `ModuleResultsStreaming`, `LlmChoiceStreaming`, `ModuleResults`, `LlmChoice`) remain available from main package exports.
